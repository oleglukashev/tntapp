export default class CustomerNote {
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
      url: `${API_URL}/company/${companyId}/customer/${customerId}/note`,
      skipAuthorization: skipJwtAuth,
      method: 'POST',
      data,
    }).then(result => result.data);
  }

  update(companyId, customerId, noteId, data, skipJwtAuth) {
    if (!companyId || !customerId || !noteId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/customer/${customerId}/note/${noteId}`,
      skipAuthorization: skipJwtAuth,
      method: 'PATCH',
      data,
    }).then(result => result.data);
  }

  delete(companyId, customerId, noteId, skipJwtAuth) {
    if (!companyId || !customerId || !noteId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/customer/${customerId}/note/${noteId}`,
      skipAuthorization: skipJwtAuth,
      method: 'DELETE',
    }).then(result => result.data);
  }

  getAll(companyId, customerId, skipJwtAuth) {
    if (!companyId || !customerId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/customer/${customerId}/note`,
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then(result => result.data);
  }
}
