import angular from 'angular';
import userMenuEdit from './user_menu.edit.controller';
import userMenuEditFactroy from './user_menu.edit.factory';

export default angular.module('app.edit_user', [])
  .controller('UserMenuEditCtrl', userMenuEdit)
  .factory('UserMenuEditFactroy', userMenuEditFactroy,
    ['UserMenu', 'Customer', 'CustomerService', 'CustomerNote', 'CustomerPreference', 'CustomerAllergies', 'moment'])
  .name;
