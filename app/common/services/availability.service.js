import { buildURL } from '../../common/utils';

export default class Availability {
  constructor($http, $q) {
    'ngInject';

    this.$http = $http;
    this.$q = $q;
  }

  getAvailabilities(companyId, productId, date, isFrontend, skipJwtAuth) {
    if (!companyId || !productId || !date) {
      return this.$q.defer().promise;
    }

    const options = {
      product_id: productId,
      is_frontend: isFrontend || true,
      date,
    };

    return this.$http({
      url: buildURL(`${API_URL}/company/${companyId}/availabilities`, options),
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then(result => result.data);
  }
}
