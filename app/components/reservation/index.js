import angular    from 'angular';
import controller from './reservation.controller';

export default angular.module('app.reservation', [])
  .controller('ReservationCtrl', controller)
  .name;
