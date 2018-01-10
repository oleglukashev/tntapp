export default class SettingsMailsCtrl {
  constructor(User, AppConstants, Settings, filterFilter, $scope, $modal, $rootScope) {
    'ngInject';

    this.current_company_id = User.getCompanyId();

    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$modal = $modal;
    this.filterFilter = filterFilter;
    this.Settings = Settings;
    this.statuses = AppConstants.mailStatuses;

    this.loadMailsSettings();
    this.loadMailsTextsSettings();

    this.is_loaded = false;
    this.$rootScope.show_spinner = true;
  }

  loadMailsSettings() {
    this.Settings
      .getMailsSettings(this.current_company_id).then(
        (mailsSettings) => {
          this.mails_settings_is_loaded = true;
          this.$rootScope.show_spinner = false;
          this.mails_settings_form_data = mailsSettings;
          this.setIsLoaded();
        }, () => {
          this.$rootScope.show_spinner = false;
        });
  }

  loadMailsTextsSettings() {
    this.Settings
      .getMailsTextsSettings(this.current_company_id).then(
        (mailsSettings) => {
          this.mails_texts_settings_is_loaded = true;
          this.mails_texts_settings = mailsSettings;
          this.setIsLoaded();
        });
  }

  submitMailsSettingsForm() {
    this.Settings
      .updateMailsSettings(this.current_company_id, this.mails_settings_form_data).then(() => {});
  }

  editMail(id) {
    const modalInstance = this.$modal.open({
      templateUrl: 'settings_mails.edit_mail.view.html',
      controller: 'SettingsMailsEditMailCtrl as edit_mail',
      size: 'md',
      resolve: {
        item: () => this.filterFilter(this.mails_texts_settings, { id })[0],
      },
    });

    modalInstance.result.then(() => {}, () => {});
  }

  setIsLoaded() {
    this.is_loaded = this.mails_settings_is_loaded && this.mails_texts_settings_is_loaded;
  }
}
