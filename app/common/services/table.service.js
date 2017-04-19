import angular from 'angular';

export default class Table {
  constructor(User, AppConstants, $http, $q) {
    'ngInject';

    this.$http          = $http;
    this.$q             = $q;
    this.AppConstants   = AppConstants;
    this.currentUser    = User.current;
    this.currentCompany = User.currentCompany;
  }

  getAll() {
    let deferred = this.$q.defer();

    if (!this.currentCompany) {
      return deferred.promise;
    }

    return this.$http({
        url: this.AppConstants.api + '/company/' + this.currentCompany.id + '/table',
        method: 'GET',
      }).then((result) => result.data);
  }
}
