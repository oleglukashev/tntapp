import angular from 'angular';
import angularMoment from 'angular-moment';
import controller from './walkin.new_reservation.controller';
import view from './walkin.new_reservation.view.html';

import ReservationService from '../../common/services/reservation.service';
import ReservationPartService from '../../common/services/reservation_part.service';
import ZoneService from '../../common/services/zone.service';
import SettingsService from '../../common/services/settings.service';
import AppConstants from '../../config.constants';
import NewReservationService from '../new_reservation/new_reservation.service';

import phoneValidDirective from '../../common/directives/phone-valid.directive';

import SuccessNewReservation from '../success.new_reservation';

export default angular.module('walkinNewReservation', [angularMoment, AppConstants, SuccessNewReservation])
  .component('walkinNewReservation', {
    controller,
    controllerAs: 'ctrl',
    template: view,
    bindings: {
      type: '<',
      resolve: '<',
    },
  })
  .service('Reservation', ReservationService)
  .service('Settings', SettingsService)
  .service('ReservationPart', ReservationPartService)
  .service('NewReservation', NewReservationService)
  .service('Zone', ZoneService)
  .directive('phoneValid', phoneValidDirective)
  .name;
