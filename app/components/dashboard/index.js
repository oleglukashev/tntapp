import angular                           from 'angular';
import routing                           from './dashboard.route';
import controller                        from './dashboard.controller';
import dashboard_reservations_controller from './reservations/dashboard_reservations.controller';
import dashboard_reservations_reservation_controller from './reservations/dashboard_reservations.reservation.controller';

export default angular.module('app.dashboard', [])
  .config(routing)
  .controller('DashboardCtrl', controller)
  .controller('DashboardReservationsCtrl', dashboard_reservations_controller)
  .controller('DashboardReservationsReservationCtrl', dashboard_reservations_reservation_controller)
  .name;
