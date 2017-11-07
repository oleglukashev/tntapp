import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './search.route';
import decorator from './search.decorator';
import controller from './search.controller';
import itemFactory from '../agenda/agenda.item.factory';
import pageFilterFactory from '../../shared/page_filter/page_filter.factory';
import reservationStatusMenuFactory from '../../shared/reservation_status_menu/reservation_status_menu.factory';

export default angular.module('app.search', [uirouter])
  .config(routing)
  .config(decorator)
  .controller('SearchCtrl', controller)
  .factory(
    'AgendaItemFactory', itemFactory,
    ['AppConstants', 'ReservationStatus', '$mdSidenav', '$rootScope'],
  )
  .factory(
    'ReservationStatusMenu', reservationStatusMenuFactory,
    ['ReservationStatus', 'Customer', 'filterFilter', 'moment', '$modal'],
  )
  .factory(
    'PageFilterFactory', pageFilterFactory,
    ['AppConstants', 'Reservation', 'Customer', '$modal', '$filter', 'moment', 'filterFilter'],
  )
  .name;
