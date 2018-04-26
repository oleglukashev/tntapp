import angular from 'angular';
import routing from './agenda.route';
import controller from './agenda.controller';
import walkInController from './walk_in/agenda_walk_in.controller';
import reservationItemFactory from '../../common/factories/reservation.item.factory';
import pageFilterFactory from '../../shared/page_filter/page_filter.factory';
import reservationStatusMenuFactory from '../../shared/reservation_status_menu/reservation_status_menu.factory';
import agendaChartsController from './charts/agenda_charts.controller';

export default angular.module('app.agenda', [])
  .config(routing)
  .controller('AgendaCtrl', controller, ['Agenda'])
  .controller('AgendaWalkInCtrl', walkInController)
  .controller('AgendaChartsCtrl', agendaChartsController)
  .factory('ReservationItemFactory', reservationItemFactory,
    ['AppConstants', 'ReservationStatus', '$mdSidenav', '$rootScope'])
  .factory('ReservationStatusMenu', reservationStatusMenuFactory,
    ['ReservationStatus', 'Customer', 'UserMenu', 'filterFilter', 'moment', '$modal'])
  .factory('PageFilterFactory', pageFilterFactory)
  .name;
