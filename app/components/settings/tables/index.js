import angular from 'angular';
import modal from 'angular-ui-bootstrap/src/modal';
import accordion from 'angular-ui-bootstrap/src/accordion';
import buttons from 'angular-ui-bootstrap/src/buttons';
import controller from './settings_tables.controller';
import view from './settings_tables.view.html';

import zoneFactory from './settings_tables.zone.factory';
import ZoneService from '../../../common/services/zone.service';
import TableService from '../../../common/services/table.service';
import TableGroupService from '../../../common/services/table_group.service';

import fixSettingsItemView from '../../fix.settings.item/fix.settings.item.view.html';
import menu from '../menu';

import dnd from '../../../shared/dnd';
import dndLists from '../../../common/directives/angular-drag-and-drop-lists.directive';

export default angular.module('tablesSettings', [
    modal,
    buttons,
    accordion,
    menu,
    dnd,
    dndLists,
  ])
  .component('tablesSettings', {
    controller,
    controllerAs: 'ctrl',
    template: view,
  })
  .component('fixSettingsItem', {
    template: fixSettingsItemView,
  })
  .service('Zone', ZoneService)
  .service('Table', TableService)
  .service('TableGroup', TableGroupService)
  .factory('SettingsTablesZoneFactory', zoneFactory, ['AppConstants'])
  .name;
