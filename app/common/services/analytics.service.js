import { buildURL } from '../../common/utils';

export default class Analytics {
  constructor($http, $q, $translate) {
    'ngInject';

    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
  }

  getAll(companyId, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/${this.$translate.proposedLanguage()}/company/${companyId}/analytics`,
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then(result => result.data);
  }

  getAverageGuestsPerDay(companyId, data, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: buildURL(`${API_URL}/${this.$translate.proposedLanguage()}/company/${companyId}/analytics/average_guests_per_day`, data),
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then(result => result.data);
  }

  getTotalAmountOfGuests(companyId, data, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: buildURL(`${API_URL}/${this.$translate.proposedLanguage()}/company/${companyId}/analytics/total_amount_of_guests`, data),
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then(result => result.data);
  }
}
