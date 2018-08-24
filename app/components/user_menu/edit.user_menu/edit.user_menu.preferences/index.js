import angular from 'angular';
import controller from './edit.user_menu.preferences.controller';
import view from './edit.user_menu.preferences.view.html';
import CustomerPreferenceService from '../../../../common/services/customer_preference.service';
import UserMenuService from '../../user_menu.service';
import CustomerSettingsNameService from '../../../../common/services/customer_settings_name.service';

export default angular.module('userMenuPreferences', [])
  .component('userMenuPreferences', {
    controller,
    controllerAs: 'ctrl',
    template: view,
    bindings: {
      dismiss: '=',
      customerPreferences: '=',
      customer: '=',
    },
  })
  .service('CustomerPreference', CustomerPreferenceService)
  .service('UserMenu', UserMenuService)
  .service('CustomerSettingsName', CustomerSettingsNameService)
  .name;
