import angular from 'angular';
import controller from './settings_untill.controller';
import view from './settings_untill.view.html';

import fixSettingsItemView from '../../fix.settings.item/fix.settings.item.view.html';
import menu from '../menu';

import TableService from '../../../common/services/table.service';
import pagination from '../../pagination';

export default angular.module('untillSettings', [menu, pagination])
  .component('untillSettings', {
    controller,
    controllerAs: 'ctrl',
    template: view,
  })
  .component('fixSettingsItem', {
    template: fixSettingsItemView,
  })
  .service('Table', TableService)
  .name;
