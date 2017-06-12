import angular                from 'angular';

import routing                from './customer_reservation.route';
import controller             from './customer_reservation.controller';

export default angular.module('app.customer_reservation', [])
  .config(routing)
  .controller('CustomerReservationCtrl', controller)
  .name;
