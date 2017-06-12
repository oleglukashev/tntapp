import angular from 'angular';

export default class DashboardCtrl {
  constructor(User, Reservation, Table, ReservationStatus, moment, AppConstants, JWT, filterFilter, $window, $mdSidenav, $rootScope, $scope, $modal) {
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
    this.$modal           = $modal;
    this.moment           = moment;
    this.ReservationStatus = ReservationStatus;

    this.status_classes  = {
      expected : 'mdi-clock',
      present  : 'mdi-check',
      delayed  : 'mdi-exclamation',
      confirmed: 'mdi-checkbox-blank-circle-outline',
      cancelled: 'mdi-close',
      request  : 'mdi-star-outline'
    };

    this.dutch_statuses = {
      'Geannuleerd': 'cancelled',
      'Bevestigd'  : 'confirmed',
      'Aanvraag'   : 'request',
      'Reservering': 'present'
    };

    this.right_menu = {
      present: [
        {
          disabled: true,
          name    : 'Aanvraag',
          status  : 'request',
          class   : 'mdi-star-outline'
        },
        {
          disabled: true,
          name    : 'Bevestig',
          status  : 'confirmed',
          class   : 'mdi-checkbox-blank-circle-outline'
        },
        {
          disabled: false,
          name    : 'Is NIET aanwezig',
          status  : 'confirmed',
          class   : 'mdi-checkbox-marked-circle'
        },
        {
          disabled: false,
          name    : 'Annuleer',
          status  : 'cancelled',
          class   : 'mdi-close-circle'
        },
      ],

      confirmed: [
        {
          disabled: false,
          name    : 'Aanvraag',
          status  : 'request',
          class   : 'mdi-star-outline'
        },
        {
          disabled: true,
          name    : 'Bevestig',
          status  : 'confirmed',
          class   : 'mdi-checkbox-blank-circle-outline'
        },
        {
          disabled: false,
          name    : 'Is aanwezig',
          status  : 'present',
          class   : 'mdi-checkbox-marked-circle'
        },
        {
          disabled: false,
          name    : 'Annuleer',
          status  : 'cancelled',
          class   : 'mdi-close-circle'
        },
      ],

      cancelled: [
        {
          disabled: false,
          name    : 'Aanvraag',
          status  : 'request',
          class   : 'mdi-star-outline'
        },
        {
          disabled: false,
          name    : 'Bevestig',
          status  : 'confirmed',
          class   : 'mdi-checkbox-blank-circle-outline'
        },
        {
          disabled: true,
          name    : 'Is aanwezig',
          status  : 'present',
          class   : 'mdi-checkbox-marked-circle'
        },
        {
          disabled: true,
          name    : 'Annuleer',
          status  : 'cancelled',
          class   : 'mdi-close-circle'
        },
      ],

      request: [
        {
          disabled: true,
          name    : 'Aanvraag',
          status  : 'request',
          class   : 'mdi-star-outline'
        },
        {
          disabled: false,
          name    : 'Bevestig',
          status  : 'confirmed',
          class   : 'mdi-checkbox-blank-circle-outline'
        },
        {
          disabled: true,
          name    : 'Is aanwezig',
          status  : 'present',
          class   : 'mdi-checkbox-marked-circle'
        },
        {
          disabled: false,
          name    : 'Annuleer',
          status  : 'cancelled',
          class   : 'mdi-close-circle'
        },
      ],
    };

    this.right_menu.delayed  = this.right_menu.confirmed;
    this.right_menu.expected = this.right_menu.present;
    this.$modal           = $modal;

    $scope.$on('DashboardCtrl.reload_reservations', () => {
      this.loadReservations();
    });

    this.loadTables();
    this.loadReservations();
  }

  changeStatus(reservation, status) {
    let dutch_status;

    Object.keys(this.dutch_statuses).map((du, en) => {
      if (this.dutch_statuses[du] == status) dutch_status = du;
    })

    this.ReservationStatus.edit(this.current_company.id, reservation.id, {
      'status': dutch_status
    })
      .then(() => {
        reservation.status = status;
        reservation = this.checkStatusForDelay(reservation);
      },
      (error) => {
        this.errors = error.data.errors;
      });
  }

  openUserMenu() {
    this.$rootScope.$broadcast('UserMenuCtrl');
    this.$mdSidenav('right').toggle();
  }

  openReservation() {
    let modalInstance = this.$modal.open({
      templateUrl: 'dashboard_reservation.view.html',
      controller: 'DashboardReservationCtrl as dash_reserv',
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

  changeTodayIconClass(reservation, reservation_part) {
    switch (reservation.status) {
      case 'present':
        this.ReservationStatus
          .setPresent(this.current_company.id, reservation.id, false)
          .then(() => {
            this.changeStatus(reservation, 'confirmed')
          });
        break;
      case 'delayed':
      case 'expected':
        this.ReservationStatus
          .setPresent(this.current_company.id, reservation.id, true)
          .then(() => {
            this.changeStatus(reservation, 'present')
          });
        break;
      default:
    }

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

  checkStatusForDelay(reservation) {
    let now = this.moment().valueOf();
    let reservation_part = reservation.reservation_parts[0];
    let reservation_time = this.moment(reservation_part.datetime).valueOf();
    let diff_mins = this.moment(reservation_time).diff(this.moment(now), 'minutes');

    if (reservation.status === 'confirmed') {
      if (diff_mins >=0 && diff_mins <= 60) {
        reservation.status = 'expected';
      } else if (diff_mins <= 0) {
        reservation.status = 'delayed';
      }
    }

    return reservation;
  }

  translateAndcheckStatusForDelay(reservations) {
    reservations.map((reservation) => {
      if (this.dutch_statuses[reservation.status])
        reservation.status = this.dutch_statuses[reservation.status]; // translate to eng
        reservation = this.checkStatusForDelay(reservation);
    });

    return reservations;
  }

  loadReservations() {
    this.Reservation
      .getAll(this.current_company.id)
        .then(
          (reservations) => {
            this.all_reservations = reservations;
            this.reservationsLoaded = true;
            this.action_required = this.translateAndcheckStatusForDelay(reservations.action_required);
            this.group_this_week = this.translateAndcheckStatusForDelay(reservations.group_this_week);
            this.today = this.translateAndcheckStatusForDelay(reservations.today);

            this.$rootScope.$broadcast('reservationsLoaded');
          });
  }
}
