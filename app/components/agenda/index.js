import angular from 'angular';
import routing from './agenda.route';
import controller from './agenda.controller';
import quickReservationController from './quick_reservation/agenda_quick_reservation.controller';
import service from './agenda.service';

export default angular.module('app.agenda', [])
  .config(routing)
  .controller('AgendaCtrl', controller, ['Agenda'])
  .service('Agenda', service)
  .controller('AgendaQuickReservationCtrl', quickReservationController)
  .name;
