import angular from 'angular';

export default class Settings {
  constructor(User, AppConstants, $http, $q) {
    'ngInject';

    this.$http          = $http;
    this.$q             = $q;
    this.AppConstants   = AppConstants;
    this.currentUser    = User.current;
    this.currentCompany = User.currentCompany;
  }

  getGeneralSettings() {
    // need to think how can we optimize this block for each method
    if (!this.currentCompany) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: this.AppConstants.api + '/company/' + this.currentCompany.id + '/settings/general',
      method: 'GET',
    }).then((result) => result.data);
  }

  getMailsSettings() {
    if (!this.currentCompany) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: this.AppConstants.api + '/company/' + this.currentCompany.id + '/settings/mails',
      method: 'GET',
    }).then((result) => result.data);
  }

  getMailsTextsSettings() {
    if (!this.currentCompany) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: this.AppConstants.api + '/company/' + this.currentCompany.id + '/settings/mails_texts',
      method: 'GET',
    }).then((result) => result.data);
  }

  updateGeneralSettings(data) {
    if (!this.currentCompany) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: this.AppConstants.api + '/company/' + this.currentCompany.id + '/settings/general',
      method: 'PATCH',
      data: data
    }).then((result) => result.data);
  }

  updateMailsSettings(data) {
    if (!this.currentCompany) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: this.AppConstants.api + '/company/' + this.currentCompany.id + '/settings/mails',
      method: 'PATCH',
      data: data
    }).then((result) => result.data);
  }
}
