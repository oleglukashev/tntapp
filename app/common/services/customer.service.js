import angular from 'angular';

export default class Customer {
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
      url: `${API_URL}/company/${companyId}/customer`,
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then(result => result.data);
  }

  search(companyId, query, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/customer/search?query=${query}`,
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then(result => result.data);
  }

  searchReservationsByCustomerId(companyId, customerId, skipJwtAuth) {
    if (!companyId || !customerId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/customer/${customerId}/full_data`,
      skipAuthorization: skipJwtAuth,
      method: 'POST',
    }).then(result => result.data);
  }

  exportCSV(companyId, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/customer/csv`,
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then((result) => {
      const anchor = angular.element('<a/>');
      anchor.attr({
        href: `data:attachment/csv;charset=utf-8,${encodeURI(result.data)}`,
        target: '_blank',
        download: 'export.csv',
      })[0].click();
    });
  }

  edit(companyId, customerId, data, skipJwtAuth) {
    if (!companyId || !customerId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/customer/${customerId}`,
      skipAuthorization: skipJwtAuth,
      method: 'PATCH',
      data,
    }).then(result => result.data);
  }

  setRegular(companyId, customerId, data, skipJwtAuth) {
    if (!companyId || !customerId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/customer/${customerId}/set_regular`,
      skipAuthorization: skipJwtAuth,
      method: 'PATCH',
      data,
    }).then(result => result.data);
  }
}
