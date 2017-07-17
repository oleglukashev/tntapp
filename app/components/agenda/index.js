import angular                      from 'angular';
import routing                      from './agenda.route';
import controller                   from './agenda.controller';
import quick_reservation_controller from './quick_reservation/agenda_quick_reservation.controller.js';

export default angular.module('app.agenda', [])
  .config(routing)
  .controller('AgendaCtrl', controller)
  .controller('AgendaQuickReservationCtrl', quick_reservation_controller)
  .name;