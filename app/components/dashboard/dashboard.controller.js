import angular from 'angular';

export default class DashboardCtrl {
  constructor(Reservation, Table, moment, AppConstants, JWT, filterFilter, $window, $mdSidenav, $rootScope, $scope, $modal) {
    'ngInject';

    this.moment          = moment;
    this.action_required = [];
    this.group_this_week = [];
    this.today           = [];
    this.$mdSidenav      = $mdSidenav;
    this.$rootScope      = $rootScope;
    this.filterFilter    = filterFilter;
    this.$scope          = $scope;
    this.$modal          = $modal;
    this.$window         = $window;

    this.Reservation     = Reservation;
    this.Table           = Table;

    $scope.$on('DashboardCtrl.reload_reservations', () => {
      this.loadReservations();
    });

    this.loadTables();
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

  getTableNumbersByTableIds(table_ids) {
    let result = [];
    let that = this;
    
    angular.forEach(table_ids, function(value) {
      let table = that.filterFilter(that.tables, { id: value })[0];

      if (table) {
        this.push(table.table_number);
      }
    }, result);

    return result;
  }

  parsedDate(date) {
    return this.moment(date).format('HH:mm');
  }

  getTodayIconClass(reservation, reservation_part) {
    return null;
  }

  loadReservations() {
    this.Reservation
      .getAll()
        .then(
          (reservations) => {
            this.reservationsLoaded = true;
            this.action_required    = reservations.action_required;
            this.group_this_week    = reservations.group_this_week;
            this.today              = reservations.today;
          });
  }

  loadTables() {
    this.tables = [];

    this.Table
      .getAll()
        .then(
          (result) => {
            this.tables = result;
          });
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
