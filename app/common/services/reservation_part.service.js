export default class ReservationPart {
  constructor(User, $http, $q) {
    'ngInject';

    this.$http = $http;
    this.$q = $q;
  }

  update(companyId, reservationPartId, data) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http.patch(
      `${API_URL}/company/${companyId}/reservation_part/${reservationPartId}`,
      data,
    ).then(result => result.data);
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
}
