import angular from 'angular';
import controller from './finish.customer.reservation.controller';
import view from './finish.customer.reservation.view.html';
import ReservationService from '../../common/services/reservation.service';

import SuccessNewReservation from '../success.new_reservation';

export default angular.module('finishCustomerReservation', [SuccessNewReservation])
  .component('finishCustomerReservation', {
    controller,
    controllerAs: 'ctrl',
    template: view,
  })
  .service('Reservation', ReservationService)
  .name;
