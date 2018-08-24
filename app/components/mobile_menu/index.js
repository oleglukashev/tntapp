import angular from 'angular';
import controller from './mobile_menu.controller';
import view from './mobile_menu.view.html';

import UserService from '../../common/services/user.service';

export default angular.module('mobileMenu', [])
  .component('mobileMenu', {
    controller,
    controllerAs: 'ctrl',
    template: view,
  })
  .service('Use', UserService)
  .name;
