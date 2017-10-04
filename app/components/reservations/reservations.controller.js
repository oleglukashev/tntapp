import angular from 'angular';

export default class ReservationsCtrl {
  constructor(User, Table, Reservation, ReservationStatus, ReservationPart, moment, filterFilter,
    $mdSidenav, $scope, $rootScope, $modal, $window) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Reservation = Reservation;
    this.ReservationPart = ReservationPart;
    this.ReservationStatus = ReservationStatus;
    this.Table = Table;

    this.$rootScope = $rootScope;
    this.moment = moment;
    this.filterFilter = filterFilter;
    this.$mdSidenav = $mdSidenav;
    this.$modal = $modal;

    this.tables = [];

    this.totalNumberOfReservations = 0;
    this.totalNumberOfPersons = 0;

    this.opened = false;
    this.$window = $window;

    $scope.$on('NewReservationCtrl.reload_reservations', () => {
      this.loadReservations();
    });

    this.loadReservations();
  }

  openCustomerMenu() {
    this.$rootScope.$broadcast('UserMenuCtrl');
    this.$mdSidenav('right').toggle();
  }

  openDatepicker() {
    this.opened = true;
  }

  openReservation() {
    const modalInstance = this.$modal.open({
      templateUrl: 'dashboard_reservations.new.view.html',
      controller: 'DashboardReservationsReservationCtrl as dash_reserv',
      size: 'md',
    });

    modalInstance.result.then(() => {
    }, () => {
    });
  }

  answer(reservation) {
    const modalInstance = this.$modal.open({
      templateUrl: 'reservation_answer.view.html',
      controller: 'ReservationAnswerCtrl as antwoord',
      size: 'md',
      resolve: {
        reservation: () => reservation,
      },
    });

    modalInstance.result.then(() => {
    }, () => {
    });
  }

  changeStatus(reservation, status) {
    this.ReservationStatus
      .changeStatus(this.current_company_id, reservation, status);
  }

  loadReservations() {
    this.Reservation
      .getAll(this.current_company_id).then(
        (reservations) => {
          this.is_loaded = true;
          this.reservations = this.ReservationStatus.translateAndcheckStatusForDelay(reservations);
          this.loadTables();
          this.totalNumberOfReservations = this.reservations.length;
          this.calculateTotalNumberOfPersons();
        });
  }

  loadTables() {
    this.Table.getAll(this.current_company_id)
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
