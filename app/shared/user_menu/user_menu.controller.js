import angular from 'angular';

export default class UserMenuCtrl {
  constructor(
    User, Reservation, CustomerNote, CustomerPreference, CustomerAllergies, Customer, moment,
    $rootScope, $mdSidenav, $modal,
  ) {
    'ngInject';

    this.current_company_id = User.getCompanyId();

    this.Reservation = Reservation;
    this.CustomerNote = CustomerNote;
    this.CustomerPreference = CustomerPreference;
    this.CustomerAllergies = CustomerAllergies;

    this.moment = moment;
    this.Customer = Customer;
    this.$rootScope = $rootScope;
    this.$mdSidenav = $mdSidenav;
    this.$modal = $modal;
  }

  loadPDF(reservationId) {
    this.Reservation
      .getPDF(this.current_company_id, reservationId)
      .then();
  }

  openEditReservationModal(reservation, reservationPart) {
    const modalInstance = this.$modal.open({
      templateUrl: 'reservation_part.edit.view.html',
      controller: 'ReservationPartEditCtrl as reserv',
      size: 'md',
      resolve: {
        reservation: () => {
          return reservation;
        },
        reservationPart: () => {
          return reservationPart;
        },
      },
    });

    modalInstance.result.then(() => {
      // success
      this.loadCustomerReservations(reservation.customer.id, reservationPart.id);
    }, () => {
      // fail
    });
  }

  openEditModal() {
    const modalInstance = this.$modal.open({
      templateUrl: 'user_menu.edit.view.html',
      controller: 'UserMenuEditCtrl as edit_user',
      size: 'md',
    });

    modalInstance.result.then(() => {
      // success
    }, () => {
      // fail
    });
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

    this.Customer.edit(this.current_company_id, customer.id, data).then((responseCustomer) => {
      this.$rootScope.customer = responseCustomer;
    });
  }

  openCustomerMenu(customerId, reservationPartId) {
    this.CustomerPreference.getAll(this.current_company_id, customerId)
      .then((preferences) => {
        this.$rootScope.customer_preferences = preferences;
      });

    this.CustomerNote.getAll(this.current_company_id, customerId)
      .then((notes) => {
        this.$rootScope.customer_notes = notes;
      });

    this.CustomerAllergies.getAll(this.current_company_id, customerId)
      .then((allergies) => {
        this.$rootScope.customer_allergies = allergies;
      });

    this.Customer.findById(this.current_company_id, customerId).then((customer) => {
      this.$rootScope.customer = customer;
    });

    this.loadCustomerReservations(customerId, reservationPartId);

    this.$mdSidenav('right').open();
  }

  loadCustomerReservations(customerId, reservationPartId) {
    this.Customer.searchReservationsByCustomerId(this.current_company_id, customerId)
      .then((reservations) => {
        this.$rootScope.customer_reservations = reservations;

        if (!reservationPartId && reservations.count > 0 &&
          reservations[0].reservation_parts.count > 0) {
          reservationPartId = reservations[0].reservation_parts[0].id;
        }

        reservations.forEach((reservation) => {
          reservation.reservation_parts.forEach((part) => {
            if (part.id === reservationPartId) {
              this.$rootScope.current_reservation_part = part;
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
}
