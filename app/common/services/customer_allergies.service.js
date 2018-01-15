export default class CustomerAllergies {
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
      url: `${API_URL}/company/${companyId}/customer/${customerId}/allergies`,
      skipAuthorization: skipJwtAuth,
      method: 'POST',
      data,
    }).then(result => result.data);
  }

  update(companyId, customerId, allergiesId, data, skipJwtAuth) {
    if (!companyId || !customerId || !allergiesId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/customer/${customerId}/allergies/${allergiesId}`,
      skipAuthorization: skipJwtAuth,
      method: 'PATCH',
      data,
    }).then(result => result.data);
  }

  delete(companyId, customerId, allergiesId, skipJwtAuth) {
    if (!companyId || !customerId || !allergiesId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/customer/${customerId}/allergies/${allergiesId}`,
      skipAuthorization: skipJwtAuth,
      method: 'DELETE',
    }).then(result => result.data);
  }

  getAll(companyId, customerId, skipJwtAuth) {
    if (!companyId || !customerId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/customer/${customerId}/allergies`,
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then(result => result.data);
  }
}
