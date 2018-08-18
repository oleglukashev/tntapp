import angular from 'angular';
import modal from 'angular-ui-bootstrap/src/modal';
import controller from './settings_customer_settings_names.controller';
import view from './settings_customer_settings_names.view.html';

import CustomerSettingsNameService from '../../../common/services/customer_settings_name.service';

import fixSettingsItemView from '../../fix.settings.item/fix.settings.item.view.html';
import menu from '../menu';

export default angular.module('customerNamesSettings', [modal, menu])
  .component('customerNamesSettings', {
    controller,
    controllerAs: 'ctrl',
    template: view,
  })
  .component('fixSettingsItem', {
    template: fixSettingsItemView,
  })
  .service('CustomerSettingsName', CustomerSettingsNameService)
  .name;
