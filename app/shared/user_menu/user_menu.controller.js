export default class UserMenuCtrl {
  constructor(
    User, Reservation, ReservationStatus, ReservationPart, CustomerNote, CustomerPreference,
    CustomerAllergies, Customer, moment, $rootScope, $mdSidenav, $modal) {
    'ngInject';

    this.currentCompanyId = User.getCompanyId();

    this.Reservation = Reservation;
    this.ReservationStatus = ReservationStatus;
    this.ReservationPart = ReservationPart;
    this.CustomerNote = CustomerNote;
    this.CustomerPreference = CustomerPreference;
    this.CustomerAllergies = CustomerAllergies;

    this.moment = moment;
    this.Customer = Customer;
    this.$rootScope = $rootScope;
    this.$mdSidenav = $mdSidenav;
    this.$modal = $modal;

    this.$rootScope.reservations = [];
  }

  loadPDF(reservationId) {
    this.Reservation
      .getPDF(this.currentCompanyId, reservationId)
      .then();
  }

  openEditReservationModal(reservation, reservationPart) {
    const modalInstance = this.$modal.open({
      templateUrl: 'reservation_part.edit.view.html',
      controller: 'ReservationPartEditCtrl as reserv',
      size: 'md',
      resolve: {
        reservation: () => reservation,
        reservationPart: () => reservationPart,
      },
    });

    modalInstance.result.then(() => {
      this.loadCustomerReservations(reservation.customer.id, reservationPart.id);
    }, () => {});
  }

  openEditModal() {
    const modalInstance = this.$modal.open({
      templateUrl: 'user_menu.edit.view.html',
      controller: 'UserMenuEditCtrl as edit_user',
      size: 'md',
    });

    modalInstance.result.then(() => {}, () => {});
  }

  toggleStar(customer) {
    const data = {
      first_name: customer.first_name,
      last_name: customer.last_name,
      primary_phone_number: customer.primary_phone_number,
      secondary_phone_number: customer.secondary_phone_number,
      street: customer.street,
      house_number: customer.house_number,
      zipcode: customer.zipcode,
      city: customer.city,
      mail: customer.mail,
      date_of_birth: customer.date_of_birth,
      gender: customer.gender,
      averageRating: customer.average_rating,
      regular: !customer.regular,
    };

    this.Customer.edit(this.currentCompanyId, customer.id, data).then((customer) => {
      this.$rootScope.customer = customer;
    });
  }

  openCustomerMenu(customerId, reservationPartId) {
    this.CustomerPreference.getAll(this.currentCompanyId, customerId)
      .then((preferences) => {
        this.$rootScope.customer_preferences = preferences;
      });

    this.CustomerNote.getAll(this.currentCompanyId, customerId)
      .then((notes) => {
        this.$rootScope.customer_notes = notes;
      });

    this.CustomerAllergies.getAll(this.currentCompanyId, customerId)
      .then((allergies) => {
        this.$rootScope.customer_allergies = allergies;
      });

    this.Customer.findById(this.currentCompanyId, customerId).then((customer) => {
      this.$rootScope.customer = customer;
    });

    this.loadCustomerReservations(customerId, reservationPartId);
    this.$mdSidenav('right').open();
  }

  loadCustomerReservations(customerId, reservationPartId) {
    this.Customer.searchReservationsByCustomerId(this.currentCompanyId, customerId)
      .then((reservations) => {
        this.$rootScope.reservations = this.ReservationStatus.translateAndcheckStatusForDelay(reservations);

        reservations.forEach((reservation) => {
          reservation.reservation_parts.forEach((part) => {
            if (part.id === reservationPartId) {
              this.$rootScope.current_part = part;
              this.$rootScope.current_reservation = reservation;
            }
          });
        });
      });
  }

  closeCustomerMenu() {
    this.$mdSidenav('right').close();
  }

  parsedDate(date) {
    return this.moment(date).locale('nl').format('D MMMM YYYY HH:mm');
  }

  getPartByReservations() {
    return this.ReservationPart.partsByReservations(this.$rootScope.reservations);
  }
}
