import angular from 'angular';

class Reservation {
  constructor($http) {
    this.$http = $http;
  }

  getAll() {
    return this.$http({
        url: 'http://api.sven.thenexttable.com/api/v2/company/79/reservation',
        method: 'GET',
      }).then((res) => res.data);

  }
}

export default angular.module('services', [])
  .service('Reservation', Reservation)
  .name;

Reservation.$inject = ['$http'];