import angular from 'angular';

export default class Settings {
  constructor($http, $q) {
    'ngInject';

    this.$http           = $http;
    this.$q              = $q;
  }

  getGeneralSettings(company_id) {
    // need to think how can we optimize this block for each method
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: API_URL + '/company/' + company_id + '/settings/general',
      method: 'GET',
    }).then((result) => result.data);
  }

  getMailsSettings(company_id) {
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: API_URL + '/company/' + company_id + '/settings/mails',
      method: 'GET',
    }).then((result) => result.data);
  }

  getMailsTextsSettings(company_id) {
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: API_URL + '/company/' + company_id + '/settings/mails_texts',
      method: 'GET',
    }).then((result) => result.data);
  }

  getLimitsSettings(company_id) {
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: API_URL + '/company/' + company_id + '/settings/minimum_seats_free',
      method: 'GET',
    }).then((result) => result.data);
  }

  getPluginsSettings(company_id) {
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: API_URL + '/company/' + company_id + '/settings/plugins',
      method: 'GET',
    }).then((result) => result.data);
  }

  updateGeneralSettings(company_id, data) {
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: API_URL + '/company/' + company_id + '/settings/general',
      method: 'PATCH',
      data: data
    }).then((result) => result.data);
  }

  updateMailsSettings(company_id, data) {
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: API_URL + '/company/' + company_id + '/settings/mails',
      method: 'PATCH',
      data: data
    }).then((result) => result.data);
  }

  updateMailtext(company_id, id, data) {
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: API_URL + '/company/' + company_id + '/settings/mails_texts/' + id,
      method: 'PATCH',
      data: data
    }).then((result) => result.data);
  }

  saveLimitsSettings(company_id, data) {
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: API_URL + '/company/' + company_id + '/settings/minimum_seats_free/save',
      method: 'POST',
      data: data
    }).then((result) => result.data);
  }

  updateTnrSyncTokenSettings(company_id, data) {
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: API_URL + '/company/' + company_id + '/settings/plugins/update_tnr_sync_token',
      method: 'PATCH',
      data: data
    }).then((result) => result.data);
  }
}
