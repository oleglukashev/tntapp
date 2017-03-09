import angular from 'angular';
import uirouter from 'angular-ui-router';
import Reservation from '../../common/services/reservation';

import routing from './dashboardRoute';
import controller from './dashboardController';

export default angular.module('app.dashboard', [uirouter, Reservation])
  .config(routing)
  .controller('DashboardCtrl', controller)
  .name;