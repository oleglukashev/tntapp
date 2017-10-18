import angular from 'angular';
import routing from './dashboard.route';
import controller from './dashboard.controller';
import dashboardReservationsController from './reservations/dashboard_reservations.controller';
import dashboardReservationsReservationController from './reservations/dashboard_reservations.reservation.controller';
import itemFactroy from './reservations/dashboard_reservations.item.factory';
import reservationStatusMenuFactory from '../../shared/reservation_status_menu/reservation_status_menu.factory';

export default angular.module('app.dashboard', [])
  .config(routing)
  .controller('DashboardCtrl', controller)
  .controller('DashboardReservationsCtrl', dashboardReservationsController)
  .controller('DashboardReservationsReservationCtrl', dashboardReservationsReservationController)
  .factory('DashboardReservationsItemFactory', itemFactroy, ['AppConstants'])
  .factory('ReservationStatusMenu', reservationStatusMenuFactory,
    ['ReservationStatus', 'filterFilter', 'moment', '$modal'])
  .name;
