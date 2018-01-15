import angular from 'angular';
import routing from './reservations.route';
import controller from './reservations.controller';
import reservationItemFactory from '../../common/factories/reservation.item.factory';
import pageFilterFactory from '../../shared/page_filter/page_filter.factory';
import reservationStatusMenuFactory from '../../shared/reservation_status_menu/reservation_status_menu.factory';

export default angular.module('app.reservations', [])
  .config(routing)
  .controller('ReservationsCtrl', controller)
  .factory('ReservationItemFactory', reservationItemFactory,
    ['AppConstants', 'ReservationStatus', '$mdSidenav', '$rootScope'])
  .factory('ReservationStatusMenu', reservationStatusMenuFactory,
    ['ReservationStatus', 'Customer', 'filterFilter', 'moment', '$modal'])
  .factory('PageFilterFactory', pageFilterFactory,
    ['AppConstants', 'Reservation', 'Customer', '$modal', '$filter', 'moment', 'filterFilter'])
  .name;
