import angular from 'angular';
import routing from './reservations.route';
import controller from './reservations.controller';
import itemFactroy from '../dashboard/reservations/dashboard_reservations.item.factory';
import pageFilterFactory from '../../shared/page_filter/page_filter.factory';
import reservationStatusMenuFactory from '../../shared/reservation_status_menu/reservation_status_menu.factory';

export default angular.module('app.reservations', [])
  .config(routing)
  .controller('ReservationsCtrl', controller)
  .factory('DashboardReservationsItemFactory', itemFactroy)
  .factory('ReservationStatusMenu', reservationStatusMenuFactory,
    ['ReservationStatus', 'filterFilter', 'moment', '$modal'])
  .factory('PageFilterFactory', pageFilterFactory,
    ['Reservation', 'Customer', '$modal', 'moment'])
  .name;
