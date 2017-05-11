import angular from 'angular';

export default class Settings {
  constructor(User, AppConstants, $http, $q) {
    'ngInject';

    this.$http           = $http;
    this.$q              = $q;
    this.AppConstants    = AppConstants;
  }

  getGeneralSettings(company_id) {
    // need to think how can we optimize this block for each method
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: this.AppConstants.api + '/company/' + company_id + '/settings/general',
      method: 'GET',
    }).then((result) => result.data);
  }

  getMailsSettings(company_id) {
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: this.AppConstants.api + '/company/' + company_id + '/settings/mails',
      method: 'GET',
    }).then((result) => result.data);
  }

  getMailsTextsSettings(company_id) {
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: this.AppConstants.api + '/company/' + company_id + '/settings/mails_texts',
      method: 'GET',
    }).then((result) => result.data);
  }

  updateGeneralSettings(company_id, data) {
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: this.AppConstants.api + '/company/' + company_id + '/settings/general',
      method: 'PATCH',
      data: data
    }).then((result) => result.data);
  }

  updateMailsSettings(company_id, data) {
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: this.AppConstants.api + '/company/' + company_id + '/settings/mails',
      method: 'PATCH',
      data: data
    }).then((result) => result.data);
  }
}
