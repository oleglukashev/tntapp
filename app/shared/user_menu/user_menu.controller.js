import angular from 'angular';

export default class UserMenuCtrl {
  constructor(
    User, Reservation, ReservationPart, CustomerNote, CustomerPreference,
    CustomerAllergies, Customer, moment, $scope, $mdSidenav, $modal) {
    'ngInject';

    this.currentCompanyId = User.getCompanyId();

    this.Reservation = Reservation;
    this.ReservationPart = ReservationPart;
    this.CustomerNote = CustomerNote;
    this.CustomerPreference = CustomerPreference;
    this.CustomerAllergies = CustomerAllergies;

    this.moment = moment;
    this.Customer = Customer;
    this.$mdSidenav = $mdSidenav;
    this.$modal = $modal;

    this.clearUserMenuData();

    $scope.$on('UserMenuCtrl.load_full_data', (e, data) => {
      this.loadCustomerFullData(data.customerId, data.reservationPartId);
    });
  }

  loadPDF(reservationId) {
    this.Reservation
      .getPDF(this.currentCompanyId, reservationId)
      .then();
  }

  openEditReservationModal(reservation, reservationPart) {
    const modalInstance = this.$modal.open({
      templateUrl: 'edit_reservation.view.html',
      controller: 'EditReservationCtrl as reserv',
      size: 'md',
      resolve: {
        reservation: () => angular.copy(reservation),
        reservationPart: () => angular.copy(reservationPart),
        customer: () => angular.copy(this.customer),
        customerNotes: () => angular.copy(this.customer_notes),
        customerAllergies: () => angular.copy(this.customer_allergies),
        customerPreferences: () => angular.copy(this.customer_preferences),
      },
    });

    modalInstance.result.then(() => {}, () => {});
  }

  openEditModal() {
    const modalInstance = this.$modal.open({
      templateUrl: 'user_menu.edit.view.html',
      controller: 'UserMenuEditCtrl as edit_user',
      size: 'md',
      resolve: {
        customer: () => angular.copy(this.customer),
        customerNotes: () => angular.copy(this.customer_notes),
        customerAllergies: () => angular.copy(this.customer_allergies),
        customerPreferences: () => angular.copy(this.customer_preferences),
      },
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
      regular: !customer.regular,
    };

    this.Customer.edit(this.currentCompanyId, customer.id, data).then((customer) => {
      this.customer = customer;
    });
  }

  loadCustomerFullData(customerId, reservationPartId) {
    this.clearUserMenuData();

    this.Customer.searchReservationsByCustomerId(this.currentCompanyId, customerId)
      .then((response) => {
        this.reservations = response.reservations;
        this.customer_notes = response.notes;
        this.customer_allergies = response.allergies;
        this.customer_preferences = response.preferences;
        this.customer = response.customer;

        response.reservations.forEach((reservation) => {
          reservation.reservation_parts.forEach((part) => {
            if (part.id === reservationPartId) {
              this.current_part = part;
              this.current_reservation = reservation;
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
    return this.ReservationPart.partsByReservations(this.reservations);
  }

  clearUserMenuData() {
    this.current_part = null;
    this.current_reservation = null;
    this.customer = null;
    this.reservations = [];
    this.customer_notes = [];
    this.customer_allergies = [];
    this.customer_preferences = [];
  }
}
