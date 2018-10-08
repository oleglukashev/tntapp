import { buildURL } from '../../common/utils';

export default class Tni {
  constructor($q, $http) {
    'ngInject';

    this.$q = $q;
    this.$http = $http;
  }

  accountIsValid(companyId, data) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: buildURL(`${API_URL}/company/${companyId}/tni/account_is_valid`, data),
      method: 'GET',
      data
    }).then(result => result.data);
  }

  sendInvoice(companyId, inReservationId) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/tni/send_invoice`,
      method: 'POST',
      data: { integration_reservation_id: inReservationId }
    }).then(result => result.data);
  }

  getInvoice(companyId, invoiceId) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/tni/invoice?invoice_id=${invoiceId}`,
      method: 'GET',
    }).then(result => result.data);
  }
}
