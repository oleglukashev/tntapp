export default class UserMenuCtrl {
  constructor(Customer, moment, $scope, $rootScope, $mdSidenav) {
    'ngInject';

    this.moment          = moment;
    this.Customer        = Customer;
    this.$scope          = $scope;
    this.$rootScope      = $rootScope;
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

  openUserMenu(customerId, resetvationPartId) {
    this.closeUserMenu();

    this.Customer.findById(customerId).then(customer => {
      this.$rootScope.userData = customer[0];
      this.$rootScope.userDataLoaded = true;

      this.Customer.searchReservationsByCustomerId(customerId).then(results => {
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
