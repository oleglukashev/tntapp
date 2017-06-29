import angular    from 'angular';
import controller from './user_menu.edit.controller';

export default angular.module('app.edit_user', [])
  .controller('UserMenuEditCtrl', controller)
  .name;
