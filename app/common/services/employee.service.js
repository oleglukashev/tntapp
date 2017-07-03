export default class Employee {
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
        url: API_URL + '/company/' + company_id + '/settings/employee',
        method: 'GET',
      }).then((result) => result.data);
  }

  create(company_id, data) {
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http({
        url: API_URL + '/company/' + company_id + '/settings/employee',
        method: 'POST',
        data: data
      }).then((result) => result.data);
  }

  update(company_id, id, data) {
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http({
        url: API_URL + '/company/' + company_id + '/settings/employee/' + id,
        method: 'PATCH',
        data: data
      }).then((result) => result.data);
  }

  destroy(company_id, id) {
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http({
        url: API_URL + '/company/' + company_id + '/settings/employee/' + id,
        method: 'DELETE'
      }).then((result) => result.data);
  }
}
