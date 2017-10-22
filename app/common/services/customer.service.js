export default class Customer {
  constructor($http, $q) {
    'ngInject';

    this.$http           = $http;
    this.$q              = $q;
  }

  getAll(company_id) {
    let deferred = this.$q.defer();

    if (!company_id) {
      return deferred.promise;
    }

    return this.$http({
      url: API_URL + '/company/' + company_id + '/customer',
      method: 'GET',
    }).then((result) => {
      return result.data;
    });
  }

  getAllForSearch(company_id) {
    let deferred = this.$q.defer();

    if (!company_id) {
      return deferred.promise;
    }

    return this.$http({
      url: API_URL + '/company/' + company_id + '/customer',
      method: 'GET',
    }).then((result) => {
      return result.data;
    });
  }

  searchReservationsByCustomerId(company_id, customer_id) {
    let deferred = this.$q.defer();

    if (!company_id) {
      return deferred.promise;
    }

    return this.$http({
      url: API_URL + '/company/' + company_id + '/customer/' + customer_id + '/reservations',
      method: 'POST',
    }).then((result) => {
      return result.data;
    });
  }

  exportCSV(company_id) {
    let deferred = this.$q.defer();

    if (!company_id) {
      return deferred.promise;
    }

    return this.$http({
      url: API_URL + '/company/' + company_id + '/customer/csv',
      method: 'GET',
    }).then((result) => {
      var anchor = angular.element('<a/>');
      anchor.attr({
         href: 'data:attachment/csv;charset=utf-8,' + encodeURI(result.data),
         target: '_blank',
         download: 'export.csv'
      })[0].click();
    });
  }

  edit(company_id, customer_id, data) {
    let deferred = this.$q.defer();

    if (!company_id) {
      return deferred.promise;
    }

    return this.$http.patch(API_URL + '/company/' + company_id + '/customer/' + customer_id,
      data
    ).then((result) => result.data);
  }

  setRegular(company_id, customer_id, data) {
    let deferred = this.$q.defer();

    if (!company_id) {
      return deferred.promise;
    }

    return this.$http.patch(API_URL + '/company/' + company_id + '/customer/' + customer_id + '/set_regular',
      data
    ).then((result) => result.data);
  }
}

