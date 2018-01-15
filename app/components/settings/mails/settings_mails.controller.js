export default class SettingsMailsCtrl {
  constructor(User, AppConstants, Settings, filterFilter, $scope, $modal) {
    'ngInject';

    this.current_company_id = User.getCompanyId();

    this.$scope = $scope;
    this.$modal = $modal;
    this.filterFilter = filterFilter;
    this.Settings = Settings;
    this.is_loaded = false;
    this.statuses = AppConstants.mailStatuses;

    this.loadMailsSettings();
    this.loadMailsTextsSettings();
  }

  loadMailsSettings() {
    this.Settings
      .getMailsSettings(this.current_company_id)
        .then(
          (mailsSettings) => {
            this.mails_settings_is_loaded = true;
            this.mails_settings_form_data = mailsSettings;
            this.setIsLoaded();
          });
  }

  loadMailsTextsSettings() {
    this.Settings
      .getMailsTextsSettings(this.current_company_id)
        .then(
          (mailsSettings) => {
            this.mails_texts_settings_is_loaded = true;
            this.mails_texts_settings = mailsSettings;
            this.setIsLoaded();
          });
  }

  submitMailsSettingsForm() {
    this.Settings
      .updateMailsSettings(this.current_company_id, this.mails_settings_form_data)
        .then(() => {
        });
  }

  editMail(id) {
    const modalInstance = this.$modal.open({
      templateUrl: 'settings_mails.edit_mail.view.html',
      controller: 'SettingsMailsEditMailCtrl as edit_mail',
      size: 'md',
      resolve: {
        item: () => {
          return this.filterFilter(this.mails_texts_settings, { id: id })[0];
        },
      },
    });

    modalInstance.result.then(() => {
      // success
    }, () => {
      // fail
    });
  }

  setIsLoaded() {
    this.is_loaded = this.mails_settings_is_loaded && this.mails_texts_settings_is_loaded;
  }
}
