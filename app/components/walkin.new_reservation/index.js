import angular from 'angular';
import angularMoment from 'angular-moment';
import controller from './walkin.new_reservation.controller';
import view from './walkin.new_reservation.view.html';

import ReservationService from '../../common/services/reservation.service';
import ReservationPartService from '../../common/services/reservation_part.service';
import ZoneService from '../../common/services/zone.service';
import AppConstants from '../../config.constants';
import NewReservationService from '../new_reservation/new_reservation.service';

import nameController from '../new_reservation/person.new_reservation_tab/name.new_reservation.controller';
import nameView from '../new_reservation/person.new_reservation_tab/name.new_reservation.view.html';

import SuccessNewReservation from '../success.new_reservation';

export default angular.module('walkinNewReservation', [angularMoment, AppConstants, SuccessNewReservation])
  .component('walkinNewReservation', {
    controller,
    controllerAs: 'ctrl',
    template: view,
    bindings: {
      type: '<',
      resolve: '<',
      isSuccess: '=',
      settings: '<',
    },
  })
  .component('walkinNameNewReservation', {
    controller: nameController,
    controllerAs: 'ctrl',
    template: nameView,
    bindings: {
      currentCompanyId: '<',
      reservation: '=',
    },
  })
  .service('Reservation', ReservationService)
  .service('ReservationPart', ReservationPartService)
  .service('NewReservation', NewReservationService)
  .service('Zone', ZoneService)
  .name;
