import angular from 'angular';

export default class Zone {
  constructor(User, AppConstants, $http, $q) {
    'ngInject';

    this.$http           = $http;
    this.$q              = $q;
    this.AppConstants    = AppConstants;
  }

  getAll(company_id) {
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http({
        url: this.AppConstants.api + '/company/' + company_id + '/zone',
        method: 'GET',
      }).then((result) => result.data);
  }
}
