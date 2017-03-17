import angular from 'angular';

export default class Reservation {
  constructor($http) {
    'ngInject';

    this.$http = $http;
  }

  getAll() {
    return this.$http({
        url: 'http://api.sven.thenexttable.com/api/v2/company/79/reservation',
        method: 'GET',
      }).then((res) => res.data);

  }
}
