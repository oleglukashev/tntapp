import angular from 'angular';
import routing from './dashboard.route';
import controller from './dashboard.controller';
import dashboardReservationsController from './reservations/dashboard_reservations.controller';
import dashboardReservationsReservationController from './reservations/dashboard_reservations.reservation.controller';

export default angular.module('app.dashboard', [])
  .config(routing)
  .controller('DashboardCtrl', controller)
  .controller('DashboardReservationsCtrl', dashboardReservationsController)
  .controller('DashboardReservationsReservationCtrl', dashboardReservationsReservationController)
  .name;
