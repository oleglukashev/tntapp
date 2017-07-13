export default class DashboardReservationsCtrl {
  constructor(User, Reservation, ReservationStatus, Table, filterFilter, moment, $scope, $rootScope, $mdSidenav, $modal, $window) {
    'ngInject';

    this.current_company    = User.current_company;
    this.Reservation        = Reservation;
    this.ReservationStatus  = ReservationStatus;
    this.Table              = Table;
    this.filterFilter       = filterFilter;
    this.$rootScope         = $rootScope;
    this.$mdSidenav         = $mdSidenav;
    this.$modal             = $modal;
    this.$window            = $window;
    this.moment             = moment;
    this.tables             = [];
    this.action_required    = [];
    this.group_this_week    = [];
    this.today              = [];

    $scope.$on('NewReservationCtrl.reload_reservations', () => {
      this.loadReservations();
    });

    this.loadReservations();
  }

  filtered(array) {
    if (!this.date_filter) {
      return array;
    }

    return this.filterFilter(array, (item) => {
      return this.moment(item.datetime).format('YYYY-MM-DD') === this.moment(this.date_filter).format('YYYY-MM-DD');
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

  openCustomerMenu() {
    this.$rootScope.$broadcast('UserMenuCtrl');
    this.$mdSidenav('right').toggle();
  }

  showAnswerButton() {
    return true;
  }

  answer() {
    // TEST
    let reservation = this.action_required[0];

    let modalInstance = this.$modal.open({
      templateUrl: 'reservation_answer.view.html',
      controller: 'ReservationAnswerCtrl as antwoord',
      size: 'md',
      resolve: {
        reservation: () => {
          return reservation;
        },
        today_reservation: () => {
          return this.filterFilter(this.today, { id: reservation.id })[0];
        },
        group_this_week_reservation: () => {
          return this.filterFilter(this.group_this_week, { id: reservation.id })[0];
        },
        action_required_reservations: () => {
          return this.action_required;
        }
      }
    });

    modalInstance.result.then((selectedItem) => {
      //success
    }, () => {
      // fail
    });
  }

  changeStatus(reservation, status) {
    this.ReservationStatus
      .changeStatus(this.current_company.id, reservation, status)
        .then((reservation) => {
          let datetime                        = reservation.reservation_parts[0];
          let action_required_has_reservation = this.filterFilter(this.action_required, { id: reservation.id })[0];

          if (reservation.status === "request" &&
              datetime &&
              this.moment(datetime).format('YYYY-MM-DD') === this.moment().format('YYYY-MM-DD')) {

            if (! action_required_has_reservation) {
              this.action_required.push(reservation);
            }
          } else {
            let index = this.action_required.map((item) => { return item.id }).indexOf(reservation.id);

            if (action_required_has_reservation) {
              this.action_required.splice(index, 1);
            }
          }
        }, (error) => {
          // nothing
        });
  }

  loadReservations() {
    this.Reservation
      .getAllGrouped(this.current_company.id)
        .then(
          (reservations) => {
            this.all_reservations   = reservations;
            this.action_required    = this.ReservationStatus.translateAndcheckStatusForDelay(reservations.action_required);
            this.group_this_week    = this.ReservationStatus.translateAndcheckStatusForDelay(reservations.group_this_week);
            this.today              = this.ReservationStatus.translateAndcheckStatusForDelay(reservations.today);
            this.loadTables();
            this.reservationsLoaded = true;
            this.$rootScope.$broadcast('reservationsLoaded', reservations);
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

  hasReservations() {
    return this.action_required.length || this.group_this_week.length || this.today.length
  }
}
