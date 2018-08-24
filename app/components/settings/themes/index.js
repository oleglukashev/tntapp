import angular from 'angular';
import controller from './settings_themes.controller';
import view from './settings_themes.view.html';

import menu from '../menu';

export default angular.module('themesSettings', [menu])
  .component('themesSettings', {
    controller,
    controllerAs: 'ctrl',
    template: view,
  })
  .name;
