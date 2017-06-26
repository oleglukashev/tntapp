import angular from 'angular';
import routing from './agenda.route';
import controller from './agenda.controller';
export default angular.module('app.agenda', [])
  .config(routing)
  .controller('AgendaCtrl', controller)
  .name;