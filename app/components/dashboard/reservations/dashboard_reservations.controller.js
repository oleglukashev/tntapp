export default class DashboardReservationsCtrl {
  constructor(
    User, Reservation, DashboardReservationsItemFactory, ReservationStatusMenu,
    ReservationPart, Table, filterFilter, moment, $scope, $rootScope, $mdSidenav,
    $modal, $window,
  ) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Reservation = Reservation;
    this.ReservationPart = ReservationPart;
    this.Table = Table;
    this.filterFilter = filterFilter;
    this.$rootScope = $rootScope;
    this.$mdSidenav = $mdSidenav;
    this.$modal = $modal;
    this.$window = $window;
    this.moment = moment;
    this.tables = [];
    this.action_required = [];
    this.group_this_week = [];
    this.today = [];

    $scope.$on('NewReservationCtrl.reload_reservations', () => {
      this.loadReservations();
    });

    this.loadReservations();
    ReservationStatusMenu(this);
    DashboardReservationsItemFactory(this);
  }

  openCustomerMenu() {
    this.$rootScope.$broadcast('UserMenuCtrl');
    this.$mdSidenav('right').toggle();
  }

  loadReservations() {
    this.Reservation
      .getAllGrouped(this.current_company_id).then(
        (reservations) => {
          this.all_reservations = reservations;
          this.setData();
          this.loadTables();
          this.reservationsLoaded = true;
          this.$rootScope.$broadcast('reservationsLoaded', reservations);
        });
  }

  setData() {
    ['action_required', 'group_this_week', 'today'].forEach((item) => {
      const result = [];
      const tempData = this.all_reservations[item];
      tempData.forEach((reservation) => {
        reservation.reservation_parts.forEach((part) => {
          result.push(this.rowPart(part, reservation));
        });
      });

      this[item] = result;
    });
  }

  loadTables() {
    this.Table
      .getAll(this.current_company_id).then(
        (result) => {
          this.tables = result;
        });
  }

  hasReservations() {
    return this.action_required.length || this.group_this_week.length || this.today.length;
  }
}
