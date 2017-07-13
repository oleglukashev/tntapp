import angular from 'angular';

export default class Reservation {
  constructor(JWT, Upload, moment, $http, $q) {
    'ngInject';

    this.moment          = moment;
    this.$http           = $http;
    this.$q              = $q;
    this.JWT             = JWT;
    this.Upload          = Upload;
  }

  getAll(company_id, date) {
    let deferred = this.$q.defer();

    if (! company_id) {
      return deferred.promise;
    }

    return this.$http({
      url: API_URL + '/company/' + company_id + '/reservation?date=' + date,
      method: 'GET',
    }).then((result) => result.data);
  }

  exportCSV(company_id, date) {
    let deferred = this.$q.defer();

    if (! company_id) {
      return deferred.promise;
    }

    return this.$http({
      url: API_URL + '/company/' + company_id + '/reservation?date=' + date + '&format=csv',
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

  getAllGrouped(company_id) {
    let deferred = this.$q.defer();

    if (! company_id) {
      return deferred.promise;
    }

    return this.$http({
      url: API_URL + '/company/' + company_id + '/reservation/grouped',
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
    if (! company_id) {
      return this.$q.defer().promise;
    }
    return this.Upload.upload({
      url:  API_URL + '/company/' + company_id + '/reservation',
      data: data,
      headers: {
        Authorization: 'Bearer ' + this.JWT.get()
      }
    }).then((result) => result.data);
  }

  createCustomerReservation(company_id, data) {
    if (! company_id) {
      return this.$q.defer().promise;
    }
    return this.$http({
      url:  API_URL + '/company/' + company_id + '/reservation?is_customer=true',
      data: data,
      method: 'POST',
    }).then((result) => result.data);
  }

  updateStatus(company_id, reservation_id, data) {
    let that = this;

    if (! company_id) {
      return this.$q.defer().promise;
    }

    return that.$http({
      url: API_URL + '/company/' + company_id + '/reservation/' + reservation_id + '/update_status',
      method: 'PATCH',
      data: data
    }).then((result) => result.data);
  }
}
