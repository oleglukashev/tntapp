import angular from 'angular';

export default class ReservationsCtrl {
  constructor(User, Table, Reservation, ReservationStatus, moment, filterFilter, $mdSidenav, $scope, $rootScope, $modal, $window) {
    'ngInject';

    this.current_company = User.current_company;
    this.Reservation     = Reservation;
    this.ReservationStatus = ReservationStatus;
    this.Table           = Table;

    this.$rootScope      = $rootScope;
    this.moment          = moment;
    this.filterFilter    = filterFilter;
    this.$mdSidenav      = $mdSidenav;
    this.$modal          = $modal;

    this.tables          = [];

    this.totalNumberOfReservations = 0;
    this.totalNumberOfPersons = 0;

    this.date_options    = {
      formatYear: 'yy',
      startingDay: 1,
      showWeeks: false,
      class: 'datepicker'
    };

    this.opened          = false;
    this.init_date       = new Date();
    this.format          = 'dd-MM-yyyy';
    this.$window         = $window;

    $scope.$on('PageFilterCtrl.change_date_filter', (event, date) => {
      this.date_filter  = date;
      this.is_loaded    = false;
      this.reservations = [];
      this.loadReservations();
    });

    $scope.$on('NewReservationCtrl.reload_reservations', () => {
      this.loadReservations();
    });

    this.loadReservations();
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

  openUserMenu() {
    this.$rootScope.$broadcast('UserMenuCtrl');
    this.$mdSidenav('right').toggle();
  }

  openDatepicker() {
    this.opened = true;
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

  changeStatus(reservation, status) {
    this.ReservationStatus
      .changeStatus(this.current_company.id, reservation, status);
  }

  loadReservations() {
    this.Reservation
      .getAll(this.current_company.id, this.moment(this.date_filter).format('YYYY-MM-DD'))
        .then(
          (reservations) => {
            this.is_loaded    = true;
            this.reservations = this.ReservationStatus.translateAndcheckStatusForDelay(reservations);
            this.loadTables();
            this.totalNumberOfReservations = this.reservations.length;
            this.calculateTotalNumberOfPersons();
          });
  }

  loadTables() {
    this.Table
      .getAll(this.current_company.id)
        .then(
          (result) => {
            this.tables = result;
          });
  }

  calculateTotalNumberOfPersons() {
    this.totalNumberOfPersons = 0;
    angular.forEach(this.reservations, (reservation) => {
      angular.forEach(reservation.reservation_parts, (reservationPart) => {
        this.totalNumberOfPersons += parseInt(reservationPart.number_of_persons, 10);
      });
    });
  }
}
