export default class CustomerPreference {
  constructor($http, $q) {
    'ngInject';

    this.$http = $http;
    this.$q = $q;
  }

  create(companyId, customerId, data, skipJwtAuth) {
    if (!companyId || !customerId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/customer/${customerId}/preference`,
      skipAuthorization: skipJwtAuth,
      method: 'POST',
      data,
    }).then(result => result.data);
  }

  update(companyId, customerId, preferenceId, data, skipJwtAuth) {
    if (!companyId || !customerId || !preferenceId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/customer/${customerId}/preference/${preferenceId}`,
      skipAuthorization: skipJwtAuth,
      method: 'PATCH',
      data,
    }).then(result => result.data);
  }

  delete(companyId, customerId, preferenceId, skipJwtAuth) {
    if (!companyId || !customerId || !preferenceId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/customer/${customerId}/preference/${preferenceId}`,
      skipAuthorization: skipJwtAuth,
      method: 'DELETE',
    }).then(result => result.data);
  }

  getAll(companyId, customerId, skipJwtAuth) {
    if (!companyId || !customerId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/customer/${customerId}/preference`,
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then(result => result.data);
  }
}
