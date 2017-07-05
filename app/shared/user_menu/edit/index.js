import angular       from 'angular';
import userMenuEdit  from './user_menu.edit.controller';

export default angular.module('app.edit_user', [])
  .controller('UserMenuEditCtrl', userMenuEdit)
  .name;
