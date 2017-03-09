import angular from 'angular';

class Reservation {
  constructor($http) {
    this.$http = $http;
  }

  getAll() {
    return this.$http({
        url: 'http://127.0.0.1:8000/api/v2/company/94/reservation',
        method: 'GET',
      }).then((res) => res.data);

  }
}

export default angular.module('services', [])
  .service('Reservation', Reservation)
  .name;

Reservation.$inject = ['$http'];