import angular from 'angular';
import controller from './settings_tni.controller';
import view from './settings_tni.view.html';

import menu from '../menu';

import TniService from '../../../common/services/tni.service';

export default angular.module('tniSettings', [menu])
  .component('tniSettings', {
    controller,
    controllerAs: 'ctrl',
    template: view,
  })
  .service('Tni', TniService)
  .name;
