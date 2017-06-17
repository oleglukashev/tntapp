export default class Customer {
  constructor(User, $http, $q) {
    'ngInject';

    this.$http           = $http;
    this.$q              = $q;
    this.current_company = User.current_company;
  }

  getAll() {
    let deferred = this.$q.defer();

    if (!this.current_company) {
      return deferred.promise;
    }

    return this.$http({
      url: API_URL + '/company/' + this.current_company.id + '/customer',
      method: 'GET',
    }).then((result) => {
      return result.data;
    });
  }

  findById(id) {
    let deferred = this.$q.defer();

    if (!this.current_company) {
      return deferred.promise;
    }

    return this.$http({
      url: API_URL + '/company/' + this.current_company.id + '/customer/find_by_id/' + id,
      method: 'GET',
    }).then((result) => {
      return result.data;
    });
  }

  getAllForSearch() {
    let deferred = this.$q.defer();

    if (!this.current_company) {
      return deferred.promise;
    }

    return this.$http({
      url: API_URL + '/company/' + this.current_company.id + '/customer/find',
      method: 'POST',
    }).then((result) => {
      return result.data;
    });
  }

  searchReservationsByCustomerId(customerId) {
    let deferred = this.$q.defer();

    if (!this.current_company) {
      return deferred.promise;
    }

    return this.$http({
      url: API_URL + '/company/' + this.current_company.id + '/customer/search/' + customerId,
      method: 'POST',
    }).then((result) => {
      return result.data;
    });
  }

  exportCSV() {
    let deferred = this.$q.defer();

    if (!this.current_company) {
      return deferred.promise;
    }

    return this.$http({
      url: API_URL + '/company/' + this.current_company.id + '/customer/csv',
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
}
