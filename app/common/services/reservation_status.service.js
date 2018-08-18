export default class ReservationStatus {
  constructor(AppConstants, User, moment, $http, $q, $window, $rootScope) {
    'ngInject';

    this.$http = $http;
    this.$q = $q;
    this.$window = $window;
    this.$rootScope = $rootScope;
    this.moment = moment;
    this.AppConstants = AppConstants;
  }

  edit(companyId, reservationId, data) {
    const deferred = this.$q.defer();

    if (!companyId) {
      return deferred.promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/reservation/edit/${reservationId}/status`,
      method: 'PATCH',
      data,
    }).then(result => result.data);
  }

  changeStatus(companyId, reservation, status) {
    const deferred = this.$q.defer();

    if (!companyId) {
      return deferred.promise;
    }

    return this.edit(companyId, reservation.id, { status })
      .then(
        (result) => {
          const currentReservation = reservation;
          currentReservation.status = result.status;
          return currentReservation;
        },
        (error) => {
          this.errors = error.data.errors;
        });
  }

  sendMail(companyId, reservation, data, skipJwtAuth) {
    const deferred = this.$q.defer();

    if (!companyId) {
      return deferred.promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/reservation/${reservation.id}/send_mail`,
      skipAuthorization: skipJwtAuth,
      method: 'POST',
      data,
    }).then(
      result => result.data,
      (error) => {
        this.errors = error.data.errors;
      });
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

  getIconColor(icon) {
    const colors = {
      'mdi-star-outline': 'yellow-300',
      'mdi-checkbox-blank-circle-outline': 'orange-500',
      'mdi-check': 'teal',
      'mdi-close': 'red-100',
      'mdi-exclamation': 'red-500',
      'mdi-clock': 'orange-500',
    };

    return colors[icon];
  }
}
