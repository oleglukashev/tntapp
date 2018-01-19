export default class ReservationPart {
  constructor(User, $http, $q, moment) {
    'ngInject';

    this.$http = $http;
    this.$q = $q;
    this.moment = moment;
  }

  update(companyId, reservationPartId, data, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/reservation_part/${reservationPartId}`,
      skipAuthorization: skipJwtAuth,
      method: 'PATCH',
      data,
    }).then(result => result.data);
  }

  partsByReservations(reservations) {
    const result = [];

    reservations.forEach((reservation) => {
      reservation.reservation_parts.forEach((part) => {
        result.push(part);
      });
    });

    return result;
  }

  reservationByPart(reservations, part) {
    let result = null;

    reservations.forEach((reservation) => {
      const partIds = reservation.reservation_parts.map(currentPart => currentPart.id);

      if (partIds.includes(part.id)) {
        result = reservation;
      }
    });

    return result;
  }

  partsByDate(parts, date) {
    return parts.filter((part) => {
      return this.moment(part.date_time, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD') ===
             this.moment(date).format('YYYY-MM-DD');
    });
  }

  getNewReservationPart() {
    return {
      date: null,
      time: null,
      number_of_persons: null,
      product: null,
      tables: [],
      available_time: [],
      occupied_tables: [],
      zones_is_showed: true,
      zone: [],
      table_ids: [],
    };
  }
}
