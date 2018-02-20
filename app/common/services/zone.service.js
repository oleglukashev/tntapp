export default class Zone {
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
      url: `${API_URL}/company/${companyId}/zone`,
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then(result => result.data);
  }

  create(companyId, data, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/zone`,
      method: 'POST',
      skipAuthorization: skipJwtAuth,
      data,
    }).then(result => result.data);
  }

  update(companyId, data, zoneId, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/zone/${zoneId}`,
      method: 'PATCH',
      skipAuthorization: skipJwtAuth,
      data,
    }).then(result => result.data);
  }

  delete(companyId, id, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/zone/${id}`,
      skipAuthorization: skipJwtAuth,
      method: 'DELETE',
    }).then(result => result.data);
  }
}
