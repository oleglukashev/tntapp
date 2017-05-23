import angular from 'angular';

export default class Table {
  constructor(User, $http, $q) {
    'ngInject';

    this.$http           = $http;
    this.$q              = $q;
  }

  getAll(company_id) {
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http({
        url: API_URL + '/company/' + company_id + '/settings/table',
        method: 'GET',
      }).then((result) => result.data);
  }

  save(company_id, data) {
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: API_URL + '/company/' + company_id + '/settings/table/save',
      method: 'POST',
      data: data
    }).then((result) => result.data);
  }
}
