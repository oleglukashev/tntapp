import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './search.route';
import controller from './search.controller';
import itemFactory from '../agenda/agenda.item.factory';
import pageFilterFactory from '../../shared/page_filter/page_filter.factory';
import reservationStatusMenuFactory from '../../shared/reservation_status_menu/reservation_status_menu.factory';

export default angular.module('app.search', [uirouter])
  .config(routing)
  .controller('SearchCtrl', controller)
  .factory('AgendaItemFactory', itemFactory)
  .factory('ReservationStatusMenu', reservationStatusMenuFactory)
  .factory('PageFilterFactory', pageFilterFactory)
  .name;
