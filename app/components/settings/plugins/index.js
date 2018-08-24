import angular from 'angular';
import modal from 'angular-ui-bootstrap/src/modal';
import controller from './settings_plugins.controller';
import view from './settings_plugins.view.html';

import NotificationService from '../../../common/services/notification.service';
import UntillService from '../../../common/services/untill.service';

import fixSettingsItemView from '../../fix.settings.item/fix.settings.item.view.html';
import menu from '../menu';

export default angular.module('pluginsSettings', [modal, menu])
  .component('pluginsSettings', {
    controller,
    controllerAs: 'ctrl',
    template: view,
  })
  .component('fixSettingsItem', {
    template: fixSettingsItemView,
  })
  .service('Notification', NotificationService)
  .service('Untill', UntillService)
  .name;
