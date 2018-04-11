export default class SettingsMailsCtrl {
  constructor(User, Settings, filterFilter, $scope, $modal, $rootScope) {
    'ngInject';

    this.current_company_id = User.getCompanyId();

    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$modal = $modal;
    this.filterFilter = filterFilter;
    this.Settings = Settings;
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

          if (this.mails_settings_form_data.sender_email) {
            this.sender_email_is_loaded = true;
          }
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
    delete this.mails_settings_form_data.sender_email_confirmed;

    this.Settings
      .updateMailsSettings(this.current_company_id, this.mails_settings_form_data)
      .then((mailsSettings) => {
        if (this.mails_settings_form_data.sender_email) {
          this.sender_email_is_loaded = true;
        }
      });
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

  sendConfirmSenderEmail() {
    this.$rootScope.show_spinner = true;
    this.email_has_sent = false;

    this.Settings
      .sendConfirmSenderEmail(this.current_company_id).then(() => {
        this.email_has_sent = true;
        this.$rootScope.show_spinner = false;
      }, () => {
        this.$rootScope.show_spinner = false;
      });
  }
}
