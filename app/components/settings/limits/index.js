import angular from 'angular';
import angilarMoment from 'angular-moment';
import controller from './settings_limits.controller';
import view from './settings_limits.view.html';

import fixSettingsItemView from '../../fix.settings.item/fix.settings.item.view.html';
import menu from '../menu';

export default angular.module('limitsSettings', [angilarMoment, menu])
  .component('limitsSettings', {
    controller,
    controllerAs: 'ctrl',
    template: view,
  })
  .component('fixSettingsItem', {
    template: fixSettingsItemView,
  })
  .name;
