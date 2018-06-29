import editEmailView from './settings_emails.edit_email.view.html'
import editSmsView from './settings_emails.edit_sms.view.html'

export default class SettingsEmailsCtrl {
  constructor(User, Settings, SmsText, EmailText, filterFilter, $scope, $modal, $mdDialog,
    $rootScope, $q, moment, $translate) {
    'ngInject';

    this.User = User;
    this.current_company_id = User.getCompanyId();

    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.moment = moment;
    this.$modal = $modal;
    this.$mdDialog = $mdDialog;
    this.filterFilter = filterFilter;
    this.Settings = Settings;
    this.EmailText = EmailText;
    this.SmsText = SmsText;

    const currentCompany = User.getCompany(User.getCompanyId());
    const currentCompanyName = `${currentCompany.name} (${currentCompany.id})`;

    // run translates
    this.account_already_exist = '';
    $translate('notifications.account_already_exist', { name: currentCompanyName }).then((total) => {
      this.account_already_exist = total;
    }, (translationIds) => {
      this.account_already_exist = translationIds;
    });

    this.$rootScope.show_spinner = true;
    $q.all([
      this.Settings.getEmailsSettings(this.current_company_id),
      this.EmailText.getAll(this.current_company_id),
      this.SmsText.getAll(this.current_company_id),
    ]).then((result) => {
      this.initEmailSettings(result[0]);
      this.initEmailTexts(result[1]);
      this.initSmsTexts(result[2]);
    }, () => {
      this.$rootScope.show_spinner = false;
    });
  }

  submitEmailsSettingsForm() {
    delete this.emails_settings_form_data.sender_email_confirmed;

    this.Settings
      .updateEmailsSettings(this.current_company_id, this.emails_settings_form_data)
      .then(() => {
        if (this.emails_settings_form_data.sender_email) {
          this.sender_email_is_loaded = true;
        }
      });
  }

  editEmail(id) {
    const modalInstance = this.$modal.open({
      template: editEmailView,
      controller: 'SettingsEmailsEditEmailCtrl as edit_email',
      size: 'md',
      resolve: {
        item: () => this.filterFilter(this.email_texts, { id })[0],
      },
    });

    modalInstance.result.then(() => {}, () => {});
  }

  editSms(id) {
    const modalInstance = this.$modal.open({
      template: editSmsView,
      controller: 'SettingsEmailsEditSmsCtrl as edit_sms',
      size: 'md',
      resolve: {
        item: () => this.filterFilter(this.sms_texts, { id })[0],
      },
    });

    modalInstance.result.then(() => {}, () => {});
  }

  convertContent(content) {
    return content.replace(/\n/g, "<br />");
  }

  canActivateTwilioAccount() {
    return this.User.current.is_admin &&
      this.emails_settings_form_data &&
      this.emails_settings_form_data.twilio_status != "active";
  }

  canShowRegisterTwilioAccountBlock() {
    return this.User.current.is_admin &&
      this.emails_settings_form_data &&
      !this.emails_settings_form_data.twilio_sid;
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

  initEmailSettings(emailSettings) {
    this.emails_settings_is_loaded = true;
    this.$rootScope.show_spinner = false;
    this.emails_settings_form_data = emailSettings;

    if (this.emails_settings_form_data.sender_email) {
      this.sender_email_is_loaded = true;
    }
  }

  initEmailTexts(emailTexts) {
    this.email_texts = emailTexts;
  }

  initSmsTexts(smsTexts) {
    this.sms_texts = smsTexts;
  }

  registerTwilioSid() {
    this.$rootScope.show_spinner = true;

    this.Settings.registerTwilioSid(this.current_company_id).then((emailSettings) => {
      this.$rootScope.show_spinner = false;
      this.emails_settings_form_data.twilio_sid = emailSettings.twilio_sid;
      this.emails_settings_form_data.twilio_status = emailSettings.twilio_status;
    }, () => {
      this.$rootScope.show_spinner = false;
      const mdDialog = this.$mdDialog;
      const alert = mdDialog
        .alert()
        .title()
        .textContent(this.account_already_exist)
        .ok('Ok');

      mdDialog.show(alert).then(() => {}, () => {});
    });
  }

  updateTwilioStatus(status) {
    this.$rootScope.show_spinner = true;

    this.Settings
      .updateTwilioStatus(this.current_company_id, status)
      .then(() => {
        this.$rootScope.show_spinner = false;
        this.emails_settings_form_data.twilio_status = status;
      }, () => {
        this.$rootScope.show_spinner = false;
      });
  }

  twilioBalance() {
    this.$rootScope.show_spinner = true;

    this.Settings
      .twilioBalance(this.current_company_id)
      .then((result) => {
        this.$rootScope.show_spinner = false;
        const mdDialog = this.$mdDialog;
        const alert = mdDialog
          .alert()
          .title('Balance')
          .textContent(`${this.moment(result.date_time).format('MMM YYYY')} - €${result.balance}`)
          .ok('Ok');

        mdDialog.show(alert).then(() => {}, () => {});
      }, () => {
        this.$rootScope.show_spinner = false;
      });
  }
}
