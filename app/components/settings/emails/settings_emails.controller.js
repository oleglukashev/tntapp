import editEmailController from './settings_emails.edit_email.controller';
import editSmsController from './settings_emails.edit_sms.controller';
import createEmailsDeliveryController from './settings_emails.emails_delivery.controller';
import createPlaceholderController from './settings_emails.placeholder.controller';
import emailDeliverySentsController from './settings_emails.emails_delivery_sents.controller';
import editEmailView from './settings_emails.edit_email.view.html';
import editSmsView from './settings_emails.edit_sms.view.html';
import createEmailsDeliveryView from './settings_emails.emails_delivery.view.html';
import createPlaceholderView from './settings_emails.placeholder.view.html';
import emailDeliverySentsView from './settings_emails.emails_delivery_sents.view.html';

export default class Controller {
  constructor(User, Settings, SmsText, EmailText, Notification, EmailsDelivery, EmailsImage, Placeholder, filterFilter, $scope, $uibModal, $mdDialog,
    $rootScope, $q, moment, $translate, $interval, $timeout) {
    'ngInject';

    this.User = User;
    this.current_company_id = User.getCompanyId();

    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.moment = moment;
    this.$modal = $uibModal;
    this.$mdDialog = $mdDialog;
    this.$interval = $interval;
    this.filterFilter = filterFilter;
    this.Settings = Settings;
    this.EmailText = EmailText;
    this.SmsText = SmsText;
    this.EmailsDelivery = EmailsDelivery;
    this.EmailsImage = EmailsImage;
    this.Placeholder = Placeholder;
    this.Notification = Notification;
    this.API_URL = API_URL.replace('/api/v2', '');

    if (this.current_company_id) {
      const currentCompany = User.getCompany(this.current_company_id);

      if (currentCompany) {
        const currentCompanyName = `${currentCompany.name} (${this.current_company_id})`;

        // run translates
        this.account_already_exist = '';
        $translate('notifications.account_already_exist', { name: currentCompanyName }).then((total) => {
          this.account_already_exist = total;
        }, (translationIds) => {
          this.account_already_exist = translationIds;
        });
      }
    }

    this.is_loaded = false;
    $q.all([
      this.Settings.getEmailsSettings(this.current_company_id),
      this.EmailText.getAll(this.current_company_id),
      this.SmsText.getAll(this.current_company_id),
      this.EmailsDelivery.getAll(this.current_company_id),
      this.EmailsImage.getAll(this.current_company_id),
      this.Placeholder.getAll(this.current_company_id),
    ]).then((result) => {
      this.initEmailSettings(result[0]);
      this.initEmailTexts(result[1]);
      this.initSmsTexts(result[2]);
      this.initEmailsDeliveries(result[3]);
      this.initEmailsImages(result[4]);
      this.initPlaceholders(result[5]);
      this.is_loaded = true;
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
      controller: editEmailController,
      controllerAs: 'ctrl',
      size: 'md',
      backdrop: 'static',
      resolve: {
        item: () => this.filterFilter(this.email_texts, { id })[0],
      },
    });

    modalInstance.result.then(() => {}, () => {});
  }

  createEmailsDelivery() {
    const modalInstance = this.$modal.open({
      template: createEmailsDeliveryView,
      controller: createEmailsDeliveryController,
      controllerAs: 'ctrl',
      size: 'md',
      backdrop: 'static',
      resolve: {
        emails_deliveries: () => this.emails_deliveries,
        item: null,
      },
    });

    modalInstance.result.then((data) => {}, (data) => {});
  }

  editEmailsDelivery(item) {
    const modalInstance = this.$modal.open({
      template: createEmailsDeliveryView,
      controller: createEmailsDeliveryController,
      controllerAs: 'ctrl',
      size: 'md',
      backdrop: 'static',
      resolve: {
        emails_deliveries: () => this.emails_deliveries,
        item: item,
      },
    });

    modalInstance.result.then(() => {}, () => {});
  }

  uploadImage(file, errFiles) {
    if (file) {
      this.image_is_submiting = true;
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = (fileLoadedEvent) => {
        // start number of fix progress bar
        this.percent_upload_file = 0;
        const progressInterval = this.$interval(() => {
          this.percent_upload_file += 5;
          if (this.percent_upload_file >= 90) {
            this.$interval.cancel(progressInterval);
          }
        }, 50);

        let srcData = fileLoadedEvent.target.result;
        srcData = srcData.replace(/data:image\/(png|jpeg);base64,/g, '');

        const data = {
          file: srcData,
        };

        this.EmailsImage
          .create(this.current_company_id, data).then((result) => {
            this.$interval.cancel(progressInterval);
            this.emails_images.push({ url: result.url });
          }, (error) => {});
      };
    }

    if (errFiles && errFiles[0]) {
      this.Notification.setText(`${errFiles[0].$error} ${errFiles[0].$errorParam}`);
    }
  }

  removeEmailsImage(item) {
    const fileName = item.url.split('/').pop();
    this.EmailsImage.remove(this.current_company_id, fileName).then(() => {
      const index = this.emails_deliveries.indexOf(item);
      this.emails_images.splice(index, 1);
    });
  }

  createPlaceholder() {
    const modalInstance = this.$modal.open({
      template: createPlaceholderView,
      controller: createPlaceholderController,
      controllerAs: 'ctrl',
      size: 'md',
      backdrop: 'static',
      resolve: {
        placeholders: () => this.placeholders,
        item: null,
      },
    });

    modalInstance.result.then((data) => {}, (data) => {});
  }

  editPlaceholder(item) {
    const modalInstance = this.$modal.open({
      template: createPlaceholderView,
      controller: createPlaceholderController,
      controllerAs: 'ctrl',
      size: 'md',
      backdrop: 'static',
      resolve: {
        placeholders: () => this.placeholders,
        item: item,
      },
    });

    modalInstance.result.then((data) => {}, (data) => {});
  }

  editSms(id) {
    const modalInstance = this.$modal.open({
      template: editSmsView,
      controller: editSmsController,
      controllerAs: 'ctrl',
      size: 'md',
      backdrop: 'static',
      resolve: {
        item: () => this.filterFilter(this.sms_texts, { id })[0],
      },
    });

    modalInstance.result.then(() => {}, () => {});
  }

  openEmailsDeliveriesSents(emailDeliveryId) {
    const modalInstance = this.$modal.open({
      template: emailDeliverySentsView,
      controller: emailDeliverySentsController,
      controllerAs: 'ctrl',
      size: 'md',
      backdrop: 'static',
      resolve: {
        emailDeliveryId: () => emailDeliveryId,
      },
    });

    modalInstance.result.then(() => {}, () => {});
  }

  removeEmailsDelivery(item) {
    this.EmailsDelivery.remove(this.current_company_id, item.id).then(() => {
      const index = this.emails_deliveries.indexOf(item);
      this.emails_deliveries.splice(index, 1);
    });
  }

  removePlaceholder(item) {
    this.Placeholder.remove(this.current_company_id, item.id).then(() => {
      const index = this.placeholders.indexOf(item);
      this.placeholders.splice(index, 1);
    });
  }

  runEmailsDelivery(item) {
    this.EmailsDelivery.run(this.current_company_id, item.id).then(() => {
      this.Notification.setText('Completed');
      this.$timeout(() => {
        this.Notification.setText(null);
      }, 3000)
    });
  }

  convertContent(content) {
    return content.replace(/\n/g, "<br />");
  }

  canShowRegisterTwilioAccountBlock() {
    return this.User.isOwner() &&
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

  initEmailsDeliveries(emailsDeliveries) {
    this.emails_deliveries = emailsDeliveries;
  }

  initEmailsImages(emailsImages) {
    this.emails_images = emailsImages;
  }

  initPlaceholders(placeholders) {
    this.placeholders = placeholders;
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

  exportNewsSubscribersCSV() {
    this.Settings.exportNewsSubscribersCSV(this.current_company_id);
  }
}
