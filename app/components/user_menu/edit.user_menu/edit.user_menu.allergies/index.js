import angular from 'angular';
import controller from './edit.user_menu.allergies.controller';
import view from './edit.user_menu.allergies.view.html';
import CustomerAllergiesService from '../../../../common/services/customer_allergies.service';
import UserMenuService from '../../user_menu.service';
import CustomerSettingsNameService from '../../../../common/services/customer_settings_name.service';
import AppConstants from '../../../../config.constants';

export default angular.module('userMenuAllergies', [AppConstants])
  .component('userMenuAllergies', {
    controller,
    controllerAs: 'ctrl',
    template: view,
    bindings: {
      dismiss: '=',
      customerAllergies: '=',
      customer: '=',
    },
  })
  .service('CustomerAllergies', CustomerAllergiesService)
  .service('UserMenu', UserMenuService)
  .service('CustomerSettingsName', CustomerSettingsNameService)
  .name;
