import angular from 'angular';

export default class DashboardCtrl {
  constructor(User, Reservation, Table, moment, AppConstants, JWT, filterFilter, $window, $mdSidenav, $rootScope, $scope, $modal) {
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
    this.moment           = moment;

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
      .getAll(this.current_company.id)
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
      .getAll(this.current_company.id)
        .then(
          (result) => {
            this.tables = result;
          });
  }

  loadReservations() {
    this.Reservation
      .getAll(this.current_company.id)
        .then(
          (reservations) => {
            this.all_reservations = reservations;
            this.reservationsLoaded = true;
            this.action_required = reservations.action_required;
            this.group_this_week = reservations.group_this_week;
            this.today = reservations.today;

            this.$rootScope.$broadcast('reservationsLoaded');
    });
  }
}
