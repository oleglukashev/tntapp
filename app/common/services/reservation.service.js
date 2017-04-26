import angular from 'angular';

export default class Reservation {
  constructor(Upload, User, AppConstants, $http, $q) {
    'ngInject';

    this.$http          = $http;
    this.$q             = $q;
    this.AppConstants   = AppConstants;
    this.currentUser    = User.current;
    this.currentCompany = User.currentCompany;
    this.Upload         = Upload;
  }

  getAll() {
    let deferred = this.$q.defer();

    if (!this.currentCompany) {
      return deferred.promise;
    }

    return this.$http({
      url: this.AppConstants.api + '/company/' + this.currentCompany.id + '/reservation',
      method: 'GET',
    }).then((result) => result.data);
  }

  create(data) {
    let that = this;
    let deferred = this.$q.defer();

    if (!this.currentCompany) {
      return deferred.promise;
    }

    return that.$http({
      url: that.AppConstants.api + '/company/' + that.currentCompany.id + '/reservation',
      method: 'POST',
      data: data
    }).then((result) => result.data);
  }
}
