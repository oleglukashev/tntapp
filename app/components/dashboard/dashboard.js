import angular from 'angular';
import uirouter from 'angular-ui-router';
import Reservation from '../../common/services/reservation';

import routing from './dashboard.route';
import controller from './dashboard.controller';

export default angular.module('app.dashboard', [uirouter, Reservation])
  .config(routing)
  .controller('DashboardCtrl', controller)
  .name;