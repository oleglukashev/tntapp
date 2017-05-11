import angular from 'angular';

export default class Reservation {
  constructor(Upload, User, AppConstants, $http, $q) {
    'ngInject';

    this.$http           = $http;
    this.$q              = $q;
    this.AppConstants    = AppConstants;
    this.Upload          = Upload;
  }

  getAll(company_id) {
    let deferred = this.$q.defer();

    if (! company_id) {
      return deferred.promise;
    }

    return this.$http({
      url: this.AppConstants.api + '/company/' + company_id + '/reservation',
      method: 'GET',
    }).then((result) => result.data);
  }

  create(company_id, data) {
    let that = this;
    let deferred = this.$q.defer();

    if (! company_id) {
      return deferred.promise;
    }

    return that.$http({
      url: that.AppConstants.api + '/company/' + company_id + '/reservation',
      method: 'POST',
      data: data
    }).then((result) => result.data);
  }
}
