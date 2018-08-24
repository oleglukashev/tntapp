import angular from 'angular';
import modal from 'angular-ui-bootstrap/src/modal';
import controller from './settings_warnings.controller';
import view from './settings_warnings.view.html';

import fixSettingsItemView from '../../fix.settings.item/fix.settings.item.view.html';
import menu from '../menu';

export default angular.module('warningsSettings', [modal, menu])
  .component('warningsSettings', {
    controller,
    controllerAs: 'ctrl',
    template: view,
  })
  .component('fixSettingsItem', {
    template: fixSettingsItemView,
  })
  .name;
