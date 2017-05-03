import angular from 'angular';

export default class Settings {
  constructor(User, AppConstants, $http, $q) {
    'ngInject';

    this.$http          = $http;
    this.$q             = $q;
    this.AppConstants   = AppConstants;
    this.currentUser    = User.current;
    this.currentCompany = User.currentCompany;
  }

  getGeneral() {
    let deferred = this.$q.defer();

    if (!this.currentCompany) {
      return deferred.promise;
    }

    return this.$http({
      url: this.AppConstants.api + '/company/' + this.currentCompany.id + '/settings/general',
      method: 'GET',
    }).then((result) => result.data);
  }

  updateGeneral(data) {
    let deferred = this.$q.defer();

    if (!this.currentCompany) {
      return deferred.promise;
    }

    return this.$http({
      url: this.AppConstants.api + '/company/' + this.currentCompany.id + '/settings/general',
      method: 'PATCH',
      data: data
    }).then((result) => result.data);
  }
}
