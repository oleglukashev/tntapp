export default class Product {
  constructor($http, $q) {
    'ngInject';

    this.$http = $http;
    this.$q = $q;
  }

  getAll(companyId, hidden, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/product${(hidden ? '?hidden=true' : '')}`,
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then(result => result.data);
  }

  create(companyId, data, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/products/create`,
      skipAuthorization: skipJwtAuth,
      method: 'POST',
      data,
    }).then(result => result.data);
  }

  update(companyId, data, productId, skipJwtAuth) {
    if (!companyId || !productId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/products/${productId}`,
      skipAuthorization: skipJwtAuth,
      method: 'PATCH',
      data,
    }).then(result => result.data);
  }

  delete(companyId, productId, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/products/${productId}`,
      skipAuthorization: skipJwtAuth,
      method: 'DELETE',
    }).then(result => result.data);
  }

  hidden(companyId, productId, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/products/hidden/${productId}`,
      skipAuthorization: skipJwtAuth,
      method: 'POST',
    }).then(result => result.data);
  }
}
