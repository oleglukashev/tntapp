import angular from 'angular';
import angularMoment from 'angular-moment';
import controller from './success.new_reservation.controller';
import view from './success.new_reservation.view.html';
import ReservationService from '../../common/services/reservation.service';

export default angular.module('successNewReservation', [angularMoment])
  .component('successNewReservation', {
    controller,
    controllerAs: 'ctrl',
    template: view,
    bindings: {
      reservation: '<',
    },
  })
  .service('Reservation', ReservationService)
  .name;
