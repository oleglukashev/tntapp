import angular from 'angular';

export default class UserMenuCtrl {
  constructor(User, Reservation, ReservationPart, Customer, UserMenu, moment, $scope,
    $mdSidenav, $modal) {
    'ngInject';

    this.currentCompanyId = User.getCompanyId();

    this.Reservation = Reservation;
    this.ReservationPart = ReservationPart;

    this.moment = moment;
    this.Customer = Customer;
    this.UserMenu = UserMenu;
    this.$mdSidenav = $mdSidenav;
    this.$modal = $modal;
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
      },
    });

    modalInstance.result.then(() => {}, () => {});
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
      country: customer.country,
      house_number: customer.house_number,
      zipcode: customer.zipcode,
      city: customer.city,
      mail: customer.mail,
      date_of_birth: customer.date_of_birth,
      gender: customer.gender,
      regular: !customer.regular,
    };

    this.Customer.edit(this.currentCompanyId, customer.id, data).then((customerData) => {
      this.UserMenu.customer = customerData;
    });
  }

  closeCustomerMenu() {
    this.$mdSidenav('right').close();
  }

  parsedDate(date) {
    return this.moment(date).locale('nl').format('D MMMM YYYY HH:mm');
  }

  getPartByReservations() {
    return this.ReservationPart.partsByReservations(this.UserMenu.reservations);
  }
}
