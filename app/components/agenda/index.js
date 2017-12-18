import angular from 'angular';
import routing from './agenda.route';
import controller from './agenda.controller';
import quickReservationController from './quick_reservation/agenda_quick_reservation.controller';
import reservationItemFactory from '../../common/factories/reservation.item.factory';
import pageFilterFactory from '../../shared/page_filter/page_filter.factory';
import reservationStatusMenuFactory from '../../shared/reservation_status_menu/reservation_status_menu.factory';
import agendaChartsController from './charts/agenda_charts.controller';

export default angular.module('app.agenda', [])
  .config(routing)
  .controller('AgendaCtrl', controller, ['Agenda'])
  .controller('AgendaQuickReservationCtrl', quickReservationController)
  .controller('AgendaChartsCtrl', agendaChartsController)
  .factory('ReservationItemFactory', reservationItemFactory,
    ['AppConstants', 'ReservationStatus', '$mdSidenav', '$rootScope'])
  .factory('ReservationStatusMenu', reservationStatusMenuFactory,
    ['ReservationStatus', 'Customer', 'filterFilter', 'moment', '$modal'])
  .factory('PageFilterFactory', pageFilterFactory)
  .name;
