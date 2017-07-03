import angular from 'angular';

export default class UserMenuCtrl {
  constructor(User, Customer, moment, $rootScope, $mdSidenav, $modal) {
    'ngInject';

    this.current_company_id = User.current_company.id;

    this.moment     = moment;
    this.Customer   = Customer;
    this.$rootScope = $rootScope;
    this.$mdSidenav = $mdSidenav;
    this.$modal     = $modal;
    this.months     = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];
  }

  openEditModal(user_id) {
    let modalInstance = this.$modal.open({
      templateUrl: 'user_menu.edit.view.html',
      controller: 'UserMenuEditCtrl as edit_user',
      size: 'md'
    });

    modalInstance.result.then((selectedItem) => {
      //success
    }, () => {
      // fail
    });
  }

  openCustomerMenu(customer_id, reservation_part_id) {
    this.Customer.searchReservationsByCustomerId(this.current_company_id, customer_id).then(reservations => {
      this.$rootScope.customer_reservations = reservations;

      if (!reservation_part_id && reservations.count > 0 && reservations[0].reservation_parts.count > 0)
        reservation_part_id = reservations[0].reservation_parts[0].id;

      reservations.forEach((reservation) => {
        reservation.reservation_parts.forEach((part) => {
          if (part.id == reservation_part_id)
            this.$rootScope.current_reservation_part = part;
        });
      });
    })

    this.$mdSidenav('right').open()
  }

  closeCustomerMenu() {
    this.$mdSidenav('right').close()
  }

  parsedDate(date) {
    const day   = this.moment(date).format('D');
    const month = this.moment(date).format('M');
    const other = this.moment(date).format('YYYY HH:mm');
    return `${day} ${this.months[month]} ${other}`;
  }
}