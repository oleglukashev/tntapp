import angular from 'angular';
import modal from 'angular-ui-bootstrap/src/modal';
import controller from './settings_general.controller';
import view from './settings_general.view.html';

import fixSettingsItemView from '../../fix.settings.item/fix.settings.item.view.html';
import menu from '../menu';

export default angular.module('generalSettings', [modal, menu])
  .component('generalSettings', {
    controller,
    controllerAs: 'ctrl',
    template: view,
  })
  .component('fixSettingsItem', {
    template: fixSettingsItemView,
  })
  .name;
