export default class DashboardReservationsCtrl {
  constructor(
    User, Reservation, DashboardReservationsItemFactory, ReservationStatusMenu,
    ReservationPart, Table, filterFilter, moment, $scope, $rootScope, $mdSidenav,
    $modal, $window, Loaded,
  ) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Reservation = Reservation;
    this.Loaded = Loaded;
    this.ReservationPart = ReservationPart;
    this.Table = Table;
    this.filterFilter = filterFilter;
    this.$rootScope = $rootScope;
    this.$mdSidenav = $mdSidenav;
    this.$modal = $modal;
    this.$window = $window;
    this.moment = moment;
    this.tables = [];

    this.action_required = Loaded.reservations.action_required;
    this.group_this_week = Loaded.reservations.group_this_week;
    this.today = Loaded.reservations.today;

    $scope.$on('NewReservationCtrl.reload_reservations', () => {
      this.loadReservations();
    });

    $scope.$on('NewReservationCtrl.reset_reservation', () => {
      this.setData();
    });

    this.loadReservations();
    this.loadTables();
    ReservationStatusMenu(this);
    DashboardReservationsItemFactory(this);
  }

  loadReservations() {
    this.Reservation
      .getAllGrouped(this.current_company_id).then(
        (reservations) => {
          this.all_reservations = reservations;
          this.setData();
          this.reservationsLoaded = true;
          this.Loaded.reservations.count_per_year = reservations.count_per_year;
          this.Loaded.reservations.count_per_month = reservations.count_per_month;
          this.Loaded.reservations.count_per_week = reservations.count_per_week;
          this.Loaded.reservations.count_by_week = reservations.count_by_week;
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

      this.Loaded.reservations[item] = result;
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
    return this.Loaded.reservations.action_required.length
      || this.Loaded.reservations.group_this_week.length
      || this.Loaded.reservations.today.length;
  }
}
