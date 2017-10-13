import angular from 'angular';
import routing from './agenda.route';
import controller from './agenda.controller';
import quickReservationController from './quick_reservation/agenda_quick_reservation.controller';
import itemFactory from './agenda.item.factory';
import reservationStatusMenuFactory from '../../shared/reservation_status_menu/reservation_status_menu.factory';

export default angular.module('app.agenda', [])
  .config(routing)
  .controller('AgendaCtrl', controller, ['Agenda'])
  .controller('AgendaQuickReservationCtrl', quickReservationController)
  .factory('AgendaItemFactory', itemFactory)
  .factory('ReservationStatusMenu', reservationStatusMenuFactory,
    ['ReservationStatus', 'filterFilter', 'moment', '$modal'])
  .name;
