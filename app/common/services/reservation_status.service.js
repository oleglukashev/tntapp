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
    this.status_classes = this.AppConstants.reservationStatusClasses;
    this.dutch_statuses = this.AppConstants.reservationDutchStatuses;
    this.right_menu = this.AppConstants.reservationMenuStatuses;
    this.right_menu.delayed = this.right_menu.confirmed;
    this.right_menu.expected = this.right_menu.present;
  }

  edit(companyId, reservationId, data) {
    const deferred = this.$q.defer();

    if (!companyId) {
      return deferred.promise;
    }

    return this.$http.post(`${API_URL}/company/${companyId}/reservation/edit/${reservationId}/status`,
      data,
    ).then(result => result.data);
  }

  updatePresent(companyId, reservationId, present = true) {
    const deferred = this.$q.defer();
    const presentUrl = (present ? 'set_present' : 'unset_present');

    if (!companyId) {
      return deferred.promise;
    }

    return this.$http.patch(`${API_URL}/company/${companyId}/reservation/${presentUrl}/${reservationId}`)
      .then(result => result.data);
  }

  changeStatus(companyId, reservation, status, mail) {
    let dutchStatus = null;
    const deferred = this.$q.defer();

    if (!companyId) {
      return deferred.promise;
    }

    Object.keys(this.dutch_statuses).forEach((du) => {
      if (this.dutch_statuses[du] === status) {
        dutchStatus = du;
      }
    });

    let data = {
      status: dutchStatus,
    };

    if (mail) {
      data = Object.assign(data, mail);
    }

    return this.edit(companyId, reservation.id, data)
      .then((response) => {
        const currentReservation = reservation;
        currentReservation.status = this.dutch_statuses[response.status];
        return currentReservation;
      },
      (error) => {
        this.errors = error.data.errors;
      });
  }

  sendMail(companyId, reservation, data) {
    const deferred = this.$q.defer();

    if (!companyId) {
      return deferred.promise;
    }

    return this.$http.post(`${API_URL}/company/${companyId}/reservation/${reservation.id}/send_mail`, data)
      .then(result => result.data,
        (error) => {
          this.errors = error.data.errors;
        });
  }

  translateAndcheckStatusForDelay(reservations) {
    for (let reservation of reservations) {
      if (this.dutch_statuses[reservation.status]) {
        reservation.status = this.dutch_statuses[reservation.status]; // translate to eng
      }
    }

    return reservations;
  }

  getStatus(reservation) {
    const now = this.moment().valueOf();
    const reservationPart = reservation.reservation_parts[0];
    const reservationTime = this.moment(reservationPart.date_time).valueOf();
    const diffMins = this.moment(reservationTime).diff(this.moment(now), 'minutes');

    if (reservation.is_present) {
      return 'present';
    }

    if (diffMins >= -this.AppConstants.late_minutes &&
      diffMins <= this.AppConstants.late_minutes + 30) {
      return 'expected';
    } else if (diffMins <= -this.AppConstants.late_minutes) {
      return 'delayed';
    }

    return reservation.status;
  }

  getIcon(reservation) {
    const status = this.getStatus(reservation);

    return this.AppConstants.reservationPresentClasses[status] ||
           this.AppConstants.reservationStatusClasses[status];
  }

  getIconColor(reservation) {
    const colors = {
      'mdi-star-outline': 'yellow-100',
      'mdi-checkbox-blank-circle-outline': 'orange-500',
      'mdi-check': 'teal',
      'mdi-close': 'red-100',
      'mdi-exclamation': 'red-500',
      'mdi-clock': 'orange-500',
    };

    return colors[this.getIcon(reservation)];
  }

  setPresent(companyId, reservation, isPresent) {
    return this.updatePresent(companyId, reservation.id, isPresent)
      .then(() => {
        const currentReservation = reservation;
        currentReservation.is_present = !reservation.is_present;
        this.$rootScope.$broadcast('ReservationStatus.change_is_present', currentReservation);
      });
  }
}
