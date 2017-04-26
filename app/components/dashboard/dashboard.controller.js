export default class DashboardCtrl {
  constructor(Reservation, moment, AppConstants, JWT, $window, $mdSidenav, $rootScope, $scope, $modal) {
    'ngInject';

    this.moment          = moment;
    this.action_required = [];
    this.group_this_week = [];
    this.today           = [];
    this.$mdSidenav      = $mdSidenav;
    this.$rootScope      = $rootScope;
    this.$scope          = $scope;
    this.$modal          = $modal;

    this.Reservation     = Reservation;

    $scope.$on('DashboardCtrl.reload_reservations', () => {
      this.loadReservations();
    });

    this.loadReservations();
  }

  openUserMenu() {
    this.$rootScope.$broadcast('UserMenuCtrl');
    this.$mdSidenav('right').toggle();
  }

  openReservation() {
    let modalInstance = this.$modal.open({
      templateUrl: 'reservationContent.html',
      controller: 'ReservationCtrl as reserv',
      size: 'md'
    });

    modalInstance.result.then((selectedItem) => {
      //success
    }, () => {
      // fail
    });
  }

  parsedDate(date) {
    return this.moment(date).format('h:mm');
  }

  loadReservations() {
    this.Reservation
      .getAll()
        .then(
          (reservations) => {
            this.reservationsLoaded = true;
            this.action_required = reservations.action_required;
            this.group_this_week = reservations.group_this_week;
            this.today = reservations.today;
          });
  }
}
