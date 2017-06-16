import angular                             from 'angular';
import routing                             from './reservations.route';
import controller                          from './reservations.controller';

export default angular.module('app.reservations', [])
  .config(routing)
  .controller('ReservationsCtrl', controller)
  .name;
