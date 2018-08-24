import angular from 'angular';
import controller from './edit.user_menu.main_info.controller';
import view from './edit.user_menu.main_info.view.html';
import moment from 'angular-moment';
import UserMenuService from '../../user_menu.service';
import CustomerComponentService from '../../../../components/customers/customer.service';
import CustomerService from '../../../../common/services/customer.service';
import AppConstants from '../../../../config.constants';

export default angular.module('userMenuMainInfo', [moment, AppConstants])
  .component('userMenuMainInfo', {
    controller,
    controllerAs: 'crtl',
    template: view,
    bindings: {
      dismiss: '=',
      customer: '=',
    }
  })
  .service('UserMenu', UserMenuService)
  .service('CustomerService', CustomerComponentService)
  .service('Customer', CustomerService)
  .name;