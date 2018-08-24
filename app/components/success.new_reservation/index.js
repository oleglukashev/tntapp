import angular from 'angular';
import angularMoment from 'angular-moment';
import controller from './success.new_reservation.controller';
import view from './success.new_reservation.view.html';

export default angular.module('successNewReservation', [angularMoment])
  .component('successNewReservation', {
    controller,
    controllerAs: 'ctrl',
    template: view,
    bindings: {
      reservation: '<',
    },
  })
  .name;
