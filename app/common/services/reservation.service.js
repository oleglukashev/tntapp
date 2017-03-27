import angular from 'angular';

export default class Reservation {
  constructor(AppConstants, $http) {
    'ngInject';

    this.$http = $http;
    this.AppConstants = AppConstants;
  }

  getAll() {
    return this.$http({
      url: this.AppConstants.api + '/company/79/reservation',
      method: 'GET',
    }).then((result) => result.data);
  }
}
