import angular from 'angular';
import modal from 'angular-ui-bootstrap/src/modal';
import controller from './settings_lightspeed.controller';
import view from './settings_lightspeed.view.html';

import TableService from '../../../common/services/table.service';
import LightspeedService from '../../../common/services/lightspeed.service';

import fixSettingsItemView from '../../fix.settings.item/fix.settings.item.view.html';
import menu from '../menu';

export default angular.module('lightspeedSettings', [modal, menu])
  .component('lightspeedSettings', {
    controller,
    controllerAs: 'ctrl',
    template: view,
  })
  .component('fixSettingsItem', {
    template: fixSettingsItemView,
  })
  .service('Table', TableService)
  .service('Lightspeed', LightspeedService)
  .name;
