export default class ReservationStatus {
  constructor(AppConstants, Upload, User, moment, $http, $q, $window, $rootScope) {
    'ngInject';

    this.$http = $http;
    this.$q = $q;
    this.$window = $window;
    this.$rootScope = $rootScope;
    this.moment = moment;
    this.AppConstants = AppConstants;
    this.Upload = Upload;
  }

  edit(companyId, reservationId, data) {
    const deferred = this.$q.defer();

    if (!companyId) {
      return deferred.promise;
    }

    return this.$http.post(
      `${API_URL}/company/${companyId}/reservation/edit/${reservationId}/status`,
      data,
    ).then(result => result.data);
  }

  changeStatus(companyId, reservation, status, mail) {
    const deferred = this.$q.defer();

    if (!companyId) {
      return deferred.promise;
    }

    let data = { status };
    if (mail) data = Object.assign(data, mail);

    return this.edit(companyId, reservation.id, data)
      .then(
        (result) => {
          const currentReservation = reservation;
          currentReservation.status = result.status;
          return currentReservation;
        },
        (error) => {
          this.errors = error.data.errors;
        },
      );
  }

  sendMail(companyId, reservation, data) {
    const deferred = this.$q.defer();

    if (!companyId) {
      return deferred.promise;
    }

    return this.$http.post(`${API_URL}/company/${companyId}/reservation/${reservation.id}/send_mail`, data)
      .then(
        result => result.data,
        (error) => {
          this.errors = error.data.errors;
        },
      );
  }

  getIcon(part, reservation) {
    let status = reservation.status;

    const now = this.moment().valueOf();
    const reservationTime = this.moment(part.date_time).valueOf();
    const diffMins = this.moment(reservationTime).diff(this.moment(now), 'minutes');

    if (reservation.status === 'confirmed' &&
      diffMins >= -this.AppConstants.late_minutes &&
      diffMins <= this.AppConstants.late_minutes + 30) {
      status = 'expected';
    }

    return this.AppConstants.reservationStatusClasses[status];
  }

  getIconColor(part, reservation) {
    const colors = {
      'mdi-star-outline': 'yellow-100',
      'mdi-checkbox-blank-circle-outline': 'orange-500',
      'mdi-check': 'teal',
      'mdi-close': 'red-100',
      'mdi-exclamation': 'red-500',
      'mdi-clock': 'orange-500',
    };

    return colors[this.getIcon(part, reservation)];
  }
}
