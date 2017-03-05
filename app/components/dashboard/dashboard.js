import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './dashboardRoute';
import controller from './dashboardController';

export default angular.module('app.dashboard', [uirouter])
  .config(routing)
  .controller('DashboardCtrl', controller)
  .name;