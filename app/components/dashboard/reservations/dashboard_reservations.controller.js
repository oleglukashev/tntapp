export default class DashboardReservationsCtrl {
  constructor(User, Reservation, ReservationStatus, DashboardReservationsItemFactory,
    ReservationStatusMenu, ReservationPart, Table, filterFilter, moment, $scope,
    $rootScope, $mdSidenav, $modal, $window) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Reservation = Reservation;
    this.ReservationStatus = ReservationStatus;
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

    $scope.$on('ReservationStatus.change_is_present', (event, reservation) => {
      this.setPresentForDoubleReservation(reservation);
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
      const tempData = this.ReservationStatus.translateAndcheckStatusForDelay(this.all_reservations[item]);
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

  setPresentForDoubleReservation(currentReservation) {
    for (let partOfReservations of [this.action_required, this.group_this_week, this.today]) {
      for (let reservation of partOfReservations) {
        if (reservation.id === currentReservation.id &&
          reservation.is_present !== currentReservation.is_present) {
          reservation.is_present = currentReservation.is_present;
        }
      }
    }
  }
}
