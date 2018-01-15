export default class DashboardReservationsCtrl {
  constructor(User, Reservation, ReservationStatus, ReservationItemFactory,
    ReservationStatusMenu, ReservationPart, Table, Zone, filterFilter, moment, $scope,
    $rootScope, $mdSidenav, $modal, $window, Loaded) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Reservation = Reservation;
    this.ReservationStatus = ReservationStatus;
    this.ReservationPart = ReservationPart;
    this.Loaded = Loaded;
    this.Table = Table;
    this.Zone = Zone;
    this.filterFilter = filterFilter;
    this.$rootScope = $rootScope;
    this.$mdSidenav = $mdSidenav;
    this.$modal = $modal;
    this.$window = $window;
    this.moment = moment;
    this.tables = {};

    this.action_required = Loaded.reservations.action_required;
    this.group_this_week = Loaded.reservations.group_this_week;
    this.today = Loaded.reservations.today;
    this.latest = Loaded.reservations.latest;

    $scope.$on('NewReservationCtrl.reload_reservations', () => {
      this.loadReservations();
    });

    $scope.$on('NewReservationCtrl.reset_reservation', () => {
      this.setData();
    });

    $scope.$on('reservationStatusChanged', (e, data) => {
      this.changeStatusInAllBlocks(data.reservation.id, data.status);
    });

    this.loadZonesAndTables();
    ReservationStatusMenu(this);
    ReservationItemFactory(this);
  }

  changeStatus(currentReservation, status) {
    this.ReservationStatus
      .changeStatus(this.current_company_id, currentReservation, status).then((reservation) => {
        if (typeof this.action_required !== 'undefined') {
          const requiredReservations = this.all_reservations.action_required;
          const actionRequiredReservation =
            this.filterFilter(requiredReservations, { id: reservation.id })[0];

          if (reservation.status === 'request') {
            if (!actionRequiredReservation) requiredReservations.push(reservation);
          } else {
            const index = this.action_required.map(item => item.id).indexOf(reservation.id);
            if (actionRequiredReservation) requiredReservations.splice(index, 1);
          }

          this.changeStatusInAllBlocks(currentReservation.id, status);
        }
      });
  }

  changeStatusInAllBlocks(reservationId, status) {
    ['action_required', 'group_this_week', 'today', 'latest'].forEach((blockTittle) => {
      const reservation =
        this.filterFilter(this.all_reservations[blockTittle], { id: reservationId })[0];

      if (reservation) {
        reservation.status = status;

        this.Loaded.reservations[blockTittle].forEach((dataItem, index) => {
          if (dataItem.reservation.id === reservationId) {
            this.Loaded.reservations[blockTittle][index] = this.rowPart(dataItem.part, reservation);
          }
        });
      }
    });
  }

  changeLoadedStatus(id, status) {
    // FIXME: temporary decision, use data models for reservations
    const item = this.Loaded.reservations.today.filter(obj => obj.reservation.id === id)[0];
    if (item) {
      item.reservation.status = status;
      this.Loaded.$rootScope.$broadcast('reservationsLoaded');
    }
  }

  setData() {
    ['action_required', 'group_this_week', 'today', 'latest'].forEach((item) => {
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

  hasReservations() {
    return this.Loaded.reservations.action_required.length
      || this.Loaded.reservations.group_this_week.length
      || this.Loaded.reservations.today.length
      || this.Loaded.reservations.latest.length;
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

  loadZonesAndTables() {
    this.Zone.getAll(this.current_company_id)
      .then(
        (zones) => {
          this.zones = {};
          zones.forEach((zone) => {
            this.zones[zone.id] = zone;
          });
          this.loadTables();
        }, () => {});
  }

  loadTables() {
    this.Table
      .getAll(this.current_company_id).then(
        (tables) => {
          this.tables = {};
          tables.forEach((table) => {
            this.tables[table.id] = table;
          });
          this.loadReservations();
        });
  }
}
