import angular from 'angular';

export default class Reservation {
  constructor(User, AppConstants, $http) {
    'ngInject';

    this.$http = $http;
    this.AppConstants = AppConstants;
    this.currentUser = User.current;
  }

  getAll() {
    return this.$http({
      url: this.AppConstants.api + '/company/' + this.currentUser.id + '/reservation',
      method: 'GET',
    }).then((result) => result.data);
  }
}
