import angular from 'angular';

export default class ReservationStatus {
  constructor(Upload, User, moment, $http, $q) {
    'ngInject';

    this.$http           = $http;
    this.$q              = $q;
    this.moment          = moment;
    this.Upload          = Upload;

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
  }

  edit(company_id, reservation_id, data) {
    let deferred = this.$q.defer();

    if (! company_id) {
      return deferred.promise;
    }

    return this.$http.post(API_URL + '/company/' + company_id + '/reservation/edit/' + reservation_id + '/status',
      data
    ).then((result) => result.data);
  }

  setPresent(company_id, reservation_id, present=true) {
    let deferred = this.$q.defer();
    let present_url = (present ? 'set_present' : 'unset_present');

    if (! company_id) {
      return deferred.promise;
    }

    return this.$http.get(
      API_URL + '/company/' + company_id + '/reservation/' + present_url + '/' + reservation_id
    ).then((result) => result.data);
  }

  changeStatus(current_company_id, reservation, status) {
    let dutch_status;

    Object.keys(this.dutch_statuses).map((du, en) => {
      if (this.dutch_statuses[du] == status) dutch_status = du;
    })

    this.edit(current_company_id, reservation.id, {
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

  changeTodayIconClass(current_company_id, reservation, reservation_part) {
    switch (reservation.status) {
      case 'present':
        this.setPresent(current_company_id, reservation.id, false)
          .then(() => {
            this.changeStatus(current_company_id, reservation, 'confirmed')
          });
        break;
      case 'delayed':
      case 'expected':
        this.setPresent(current_company_id, reservation.id, true)
          .then(() => {
            this.changeStatus(current_company_id, reservation, 'present')
          });
        break;
      default:
    }

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

  parsedDate(date) {
    return this.moment(date).format('HH:mm');
  }
}
