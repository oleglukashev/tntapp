import angular from 'angular';

export default class Reservation {
  constructor(Upload, User, $http, $q) {
    'ngInject';

    this.$http           = $http;
    this.$q              = $q;
    this.Upload          = Upload;
  }

  getAll(company_id) {
    let deferred = this.$q.defer();

    if (! company_id) {
      return deferred.promise;
    }

    return this.$http({
      url: API_URL + '/company/' + company_id + '/reservation',
      method: 'GET',
    }).then((result) => result.data);
  }

  getProducts(company_id) {
    let deferred = this.$q.defer();

    if (! company_id) {
      return deferred.promise;
    }

    return this.$http({
      url: API_URL + '/company/' + company_id + '/product',
      method: 'GET',
    }).then((result) => result.data);
  }

  create(company_id, data) {
    let that = this;
    if (! company_id) {
      return this.$q.defer().promise;
    }
    return that.$http({
      url: API_URL + '/company/' + company_id + '/reservation',
      method: 'POST',
      data: data
    }).then((result) => result.data);
  }
}
