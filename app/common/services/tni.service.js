export default class Tni {
  constructor($q, $http) {
    'ngInject';

    this.$q = $q;
    this.$http = $http;
  }

  sendInvoice(companyId, inReservationId) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/tni/invoice`,
      method: 'POST',
      data: { integration_reservation_id: inReservationId }
    }).then(result => result.data);
  }
}
