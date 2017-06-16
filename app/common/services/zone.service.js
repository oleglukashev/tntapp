import angular from 'angular';

export default class Zone {
  constructor($http, $q) {
    'ngInject';

    this.$http           = $http;
    this.$q              = $q;
  }

  getAll(company_id) {
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http({
        url: API_URL + '/company/' + company_id + '/zone',
        method: 'GET',
      }).then((result) => result.data);
  }

  create(company_id, data) {
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: API_URL + '/company/' + company_id + '/zone',
      method: 'POST',
      data: data
    }).then((result) => result.data);
  }

  delete(company_id, id) {
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: API_URL + '/company/' + company_id + '/zone/' + id,
      method: 'DELETE'
    }).then((result) => result.data);
  }
}
