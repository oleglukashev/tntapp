export default class DashboardCtrl {
  constructor(User, Reservation, Table, ReservationStatus, moment, AppConstants, JWT, filterFilter, $window, $mdSidenav, $rootScope, $scope, $modal) {
    'ngInject';

    this.current_company  = User.current_company;

    this.filterFilter     = filterFilter;

    this.Reservation      = Reservation;
    this.Table            = Table;
    this.products         = {};
    this.reservations     = {};
    this.all_reservations = {};
    this.$scope           = $scope;
    this.$rootScope       = $rootScope;
    this.$window          = $window;
    this.$modal           = $modal;
    this.moment           = moment;
    this.ReservationStatus = ReservationStatus;

    this.$modal           = $modal;
  }

  openReservation() {
    let modalInstance = this.$modal.open({
      templateUrl: 'dashboard_reservations.new.view.html',
      controller: 'DashboardReservationsReservationCtrl as dash_reserv',
      size: 'md'
    });

    modalInstance.result.then((selectedItem) => {
      //success
    }, () => {
      // fail
    });
  }
}
