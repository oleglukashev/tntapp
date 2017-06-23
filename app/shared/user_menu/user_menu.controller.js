import angular from 'angular';

export default class UserMenuCtrl {
  constructor(User, Customer, moment, $scope, $rootScope, $mdSidenav, $window, AppConstants, $modal) {
    'ngInject';

    this.current_company = User.current_company;

    this.moment          = moment;
    this.Customer        = Customer;
    this.$scope          = $scope;
    this.$rootScope      = $rootScope;
    this.$modal          = $modal;
    this.$mdSidenav      = $mdSidenav;
    this.months          = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];

    $rootScope.userData                 = {};
    $rootScope.userDataLoaded           = false;
    $rootScope.userReservations         = {};
    $rootScope.userReservationsLoaded   = false;
    $rootScope.currentReservation       = {};
    $rootScope.currentReservationLoaded = false;

    $scope.$on('topic', function (event, arg) {
      alert(arg);
      $scope.receiver = 'got your ' + arg;
    });
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

  openUserMenu(customerId, resetvationPartId) {
    this.closeUserMenu();

    this.Customer.findById(this.current_company.id, customerId).then(customer => {
      this.$rootScope.userData = customer;
      this.$rootScope.userDataLoaded = true;

      this.Customer.searchReservationsByCustomerId(this.current_company.id, customerId).then(results => {
        this.$rootScope.userReservations = results;
        this.$rootScope.userReservationsLoaded = true;

        results.map((r) => {
          if (r.pid == resetvationPartId) {
            this.$rootScope.currentReservation = r;
            this.$rootScope.currentReservationLoaded = true;
          }
        })

      })
      this.$rootScope.userReservationsLoaded = false;

    })

    this.$rootScope.userDataLoaded = false;
    this.$rootScope.userReservationsLoaded = false;
    this.$rootScope.currentReservationLoaded = false;
    this.$mdSidenav('right').open()
  }

  closeUserMenu() {
    this.$mdSidenav('right').close()
  }

  parsedDate(date) {
    const day   = this.moment(date).format('D');
    const month = this.moment(date).format('M');
    const other = this.moment(date).format('YYYY h:mm');
    return `${day} ${this.months[month]} ${other}`;
  }
}