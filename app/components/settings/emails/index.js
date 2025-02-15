import angular from 'angular';
import modal from 'angular-ui-bootstrap/src/modal';
import controller from './settings_emails.controller';
import view from './settings_emails.view.html';

import SmsTextService from '../../../common/services/sms_text.service';
import EmailTextService from '../../../common/services/email_text.service';
import EmailsDeliveryService from '../../../common/services/emails_delivery.service';
import PlaceholderService from '../../../common/services/placeholder.service';

import fixSettingsItemView from '../../fix.settings.item/fix.settings.item.view.html';
import menu from '../menu';

export default angular.module('emailsSettings', [modal, menu])
  .component('emailsSettings', {
    controller,
    controllerAs: 'ctrl',
    template: view,
  })
  .component('fixSettingsItem', {
    template: fixSettingsItemView,
  })
  .service('SmsText', SmsTextService)
  .service('EmailText', EmailTextService)
  .service('EmailsDelivery', EmailsDeliveryService)
  .service('Placeholder', PlaceholderService)
  .name;
