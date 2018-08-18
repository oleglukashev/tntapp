import angular from 'angular';
import angularUiRouter from '@uirouter/angularjs';
import controller from './auth.controller';
import loginView from './auth.view.html';
import resetPasswordView from './auth.reset_password.view.html';
import activationView from './auth.activate.view.html';
import loginViaAdminView from './auth.admin_view.html';

export default angular.module('auth', [angularUiRouter])
  .component('login', {
    controller,
    controllerAs: 'ctrl',
    template: loginView,
  })
  .component('resetPassword', {
    controller,
    controllerAs: 'ctrl',
    template: resetPasswordView,
  })
  .component('activation', {
    controller,
    controllerAs: 'ctrl',
    template: activationView,
  })
  .component('loginViaAdmin', {
    controller,
    controllerAs: 'ctrl',
    template: loginViaAdminView,
  })
  .name;