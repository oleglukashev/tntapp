import angular from 'angular';

export default class Reservation {
  constructor(JWT, Upload, moment, $http, $q) {
    'ngInject';

    this.moment = moment;
    this.$http = $http;
    this.$q = $q;
    this.JWT = JWT;
    this.Upload = Upload;
  }

  getAll(companyId, date) {
    const deferred = this.$q.defer();

    if (!companyId) {
      return deferred.promise;
    }

    return this.$http({
      url: API_URL + '/company/' + companyId + '/reservation?date=' + date,
      method: 'GET',
    }).then((result) => result.data);
  }

  exportCSV(companyId, date) {
    const deferred = this.$q.defer();

    if (!companyId) {
      return deferred.promise;
    }

    return this.$http({
      url: API_URL + '/company/' + companyId + '/reservation?date=' + date + '&format=csv',
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

  getAllGrouped(companyId) {
    const deferred = this.$q.defer();

    if (!companyId) {
      return deferred.promise;
    }

    return this.$http({
      url: API_URL + '/company/' + companyId + '/reservation/grouped',
      method: 'GET',
    }).then((result) => result.data);
  }

  getProducts(companyId) {
    const deferred = this.$q.defer();

    if (!companyId) {
      return deferred.promise;
    }

    return this.$http({
      url: API_URL + '/company/' + companyId + '/product',
      method: 'GET',
    }).then((result) => result.data);
  }

  getCreateURI(companyId, params) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    const uri = API_URL + '/company/' + companyId + '/reservation';
    const additional = [];
    params.forEach((param) => {
      if (Object.values(param)[0]) {
        additional.push(encodeURIComponent(Object.keys(param)) + '=true'); // adding parameters to query string like 'confirm_mail=true' only if Object.values(param)[0] contains true
      }
    });

    return [uri, additional.join('&')].join('?');
  }

  create(companyId, data, params) {
    return this.Upload.upload({
      url: this.getCreateURI(companyId, params),
      data,
    }).then((result) => result.data);
  }

  createQuick(companyId, data) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url:  API_URL + '/company/' + companyId + '/reservation/quick',
      data,
      method: 'POST',
    }).then((result) => result.data);
  }

  updateStatus(companyId, reservationId, data) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: API_URL + '/company/' + companyId + '/reservation/' + reservationId + '/update_status',
      method: 'PATCH',
      data,
    }).then((result) => result.data);
  }
}
