export default class DashboardCtrl {
  constructor(Reservation, moment, AppConstants, JWT, $window, $mdSidenav, $rootScope, $modal) {
    'ngInject';

    this.moment          = moment;
    this.action_required = [];
    this.group_this_week = [];
    this.today           = [];
    this.$mdSidenav      = $mdSidenav;
    this.$rootScope      = $rootScope;
    this.$modal          = $modal;

    Reservation
      .getAll()
        .then(
          (reservations) => {
            this.reservationsLoaded = true;
            this.action_required = reservations.action_required;
            this.group_this_week = reservations.group_this_week;
            this.today = reservations.today;
          });
  }

  openUserMenu() {
    this.$rootScope.$broadcast('UserMenuCtrl');
    this.$mdSidenav('right').toggle();
  }

  openReservation() {
    this.$modal.open({
      templateUrl: 'reservationContent.html',
      controller: 'ReservationCtrl as reserv',
      size: 'md',
      // resolve: {
      //   items: () => {
      //     return $scope.items;
      //   }
      // }
    });
  }

  parsedDate(date) {
    return this.moment(date).format('h:mm');
  }
}
