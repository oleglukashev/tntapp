import angular from 'angular';

export default class TimeRange {
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
        url: API_URL + '/company/' + company_id + '/time_ranges',
        method: 'GET',
      }).then((result) => result.data);
  }

  edit(company_id, range_id, data) {
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http.post(API_URL + '/company/' + company_id + '/time_ranges/edit/' + range_id,
      data
    ).then((result) => result.data);
  }

  create(company_id, data) {
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: API_URL + '/company/' + company_id + '/time_ranges/create',
      method: 'POST',
      data: data
    }).then((result) => result.data);
  }

  delete(company_id, range_id) {
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http.post(API_URL + '/company/' + company_id + '/time_ranges/delete/' + range_id)
      .then((result) => result.data);
  }
}
