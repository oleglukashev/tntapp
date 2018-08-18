import angular from 'angular';
import controller from './settings_plugins_untill.controller';
import view from './settings_plugins_untill.view.html';

import fixSettingsItemView from '../../fix.settings.item/fix.settings.item.view.html';
import menu from '../menu';

export default angular.module('pluginsUntillSettings', [menu])
  .component('pluginsUntillSettings', {
    controller,
    controllerAs: 'ctrl',
    template: view,
  })
  .component('fixSettingsItem', {
    template: fixSettingsItemView,
  })
  .name;
