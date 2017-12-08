export default class TimeRange {
  constructor(User, $http, $q) {
    'ngInject';

    this.$http = $http;
    this.$q = $q;
  }

  getAll(companyId, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/time_range`,
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then(result => result.data);
  }

  getAllProductTimeRanges(companyId, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/time_ranges`,
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then(result => result.data);
  }

  getDatesClosedOpeningHoursTimeRanges(companyId, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/time_range/dates_of_closed`,
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then(result => result.data);
  }

  edit(companyId, rangeId, data, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/time_ranges/edit/${rangeId}`,
      skipAuthorization: skipJwtAuth,
      method: 'POST',
      data,
    }).then(result => result.data);
  }

  create(companyId, data, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/time_ranges/create`,
      skipAuthorization: skipJwtAuth,
      method: 'POST',
      data,
    }).then(result => result.data);
  }
}
