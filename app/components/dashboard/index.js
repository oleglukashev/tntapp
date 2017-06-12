import angular                from 'angular';

import routing                from './dashboard.route';
import controller             from './dashboard.controller';

import dashboard_reservation_controller from './reservation/dashboard_reservation.controller';

export default angular.module('app.dashboard', [])
  .config(routing)
  .controller('DashboardCtrl', controller)
  .controller('DashboardReservationCtrl', dashboard_reservation_controller)
  .name;
