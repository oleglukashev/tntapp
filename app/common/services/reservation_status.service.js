import angular from 'angular';

export default class ReservationStatus {
  constructor(AppConstants, Upload, User, moment, $http, $q, $window) {
    'ngInject';

    this.$http               = $http;
    this.$q                  = $q;
    this.$window             = $window;
    this.moment              = moment;
    this.AppConstants        = AppConstants;
    this.Upload              = Upload;
    this.status_classes      = this.AppConstants.reservationStatusClasses;
    this.dutch_statuses      = this.AppConstants.reservationDutchStatuses;
    this.right_menu          = this.AppConstants.reservationMenuStatuses;
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

  changeStatus(company_id, reservation, status, mail) {
    let dutch_status;
    let deferred = this.$q.defer();

    if (! company_id) {
      return deferred.promise;
    }

    Object.keys(this.dutch_statuses).map((du, en) => {
      if (this.dutch_statuses[du] == status) dutch_status = du;
    })

    let data = {
      status: dutch_status
    }

    if (mail) {
      data = Object.assign(data, mail);
    }

    return this.edit(company_id, reservation.id, data)
      .then((response) => {
        reservation.status = this.dutch_statuses[response.status];
        reservation = this.checkStatusForDelay(reservation);
        return reservation;
      },
      (error) => {
        this.errors = error.data.errors;
      });
  }

  sendMail(company_id, reservation, data) {
    let deferred = this.$q.defer();

    if (! company_id) {
      return deferred.promise;
    }

    return this.$http.post(API_URL + '/company/' + company_id + '/reservation/' + reservation.id + '/send_mail', data)
      .then((result) => result.data,
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
      case 'expected', 'confirmed':
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
    let reservation_time = this.moment(reservation_part.date_time).valueOf();
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
