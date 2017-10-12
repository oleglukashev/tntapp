export default class DashboardReservationsCtrl {
  constructor(User, Reservation, ReservationStatus, ReservationStatusMenu, ReservationPart, Table,
    filterFilter, moment, $scope, $rootScope, $mdSidenav, $modal, $window) {
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
  }

  filtered(array) {
    if (!this.date_filter) {
      return array;
    }

    return this.filterFilter(array, item => this.moment(item.datetime).format('YYYY-MM-DD') ===
                                            this.moment(this.date_filter).format('YYYY-MM-DD'));
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
          this.action_required = this.ReservationStatus.translateAndcheckStatusForDelay(reservations.action_required);
          this.group_this_week = this.ReservationStatus.translateAndcheckStatusForDelay(reservations.group_this_week);
          this.today = this.ReservationStatus.translateAndcheckStatusForDelay(reservations.today);
          this.loadTables();
          this.reservationsLoaded = true;
          this.$rootScope.$broadcast('reservationsLoaded', reservations);
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
