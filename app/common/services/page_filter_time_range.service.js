export default class TimeRange {
  constructor($http, $q) {
    'ngInject';

    this.$http           = $http;
    this.$q              = $q;
  }

  getAll(company_id, date) {
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http({
        url: API_URL + '/company/' + company_id + '/page_filter/time_range' + (date ? '?date=' + date : ''),
        method: 'GET',
      }).then((result) => result.data);
  }

  create(company_id, data) {
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http({
        url: API_URL + '/company/' + company_id + '/page_filter/time_range/',
        method: 'POST',
        data: data
      }).then((result) => result.data);
  }

  update(company_id, id, data) {
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http({
        url: API_URL + '/company/' + company_id + '/page_filter/time_range/' + id,
        method: 'PATCH',
        data: data
      }).then((result) => result.data);
  }

  destroy(company_id, id) {
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http({
        url: API_URL + '/company/' + company_id + '/page_filter/time_range/' + id,
        method: 'DELETE'
      }).then((result) => result.data);
  }
}
