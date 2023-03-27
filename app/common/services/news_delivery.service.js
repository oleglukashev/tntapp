export default class NewsDelivery {
  constructor($http, $q) {
    'ngInject';

    this.$http = $http;
    this.$q = $q;
  }

  getAll(companyId, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/news_deliveries`,
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then(result => result.data);
  }

  create(companyId, data, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/news_deliveries`,
      method: 'POST',
      skipAuthorization: skipJwtAuth,
      data,
    }).then(result => result.data);
  }

  run(companyId, id, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/news_deliveries/${id}/run`,
      method: 'POST',
      skipAuthorization: skipJwtAuth
    }).then(result => result.data);
  }

  remove(companyId, id, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/news_deliveries/${id}`,
      method: 'DELETE',
      skipAuthorization: skipJwtAuth
    }).then(result => result.data);
  }
}
