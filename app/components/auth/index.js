import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './auth.route';
import controller from './auth.controller';

export default angular.module('app.login', [uirouter])
  .config(routing)
  .controller('AuthCtrl', controller)
  .name;
