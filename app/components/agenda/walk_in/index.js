import angular from 'angular';
import angularMoment from 'angular-moment';

import controller from './agenda_walk_in.controller';
import view from './agenda_walk_in.view.html';

import TableService from '../../../common/services/table.service';
import ReservationService from '../../../common/services/reservation.service';
import ReservationPartService from '../../../common/services/reservation_part.service';
import ConfirmService from '../../../common/services/confirm.service';

import WalkinNewReservation from '../../walkin.new_reservation';

export default angular.module('agendaWalkIn', [angularMoment, WalkinNewReservation])
  .component('agendaWalkIn', {
    controller,
    controllerAs: 'ctrl',
    template: view,
    bindings: {
      resolve: '<',
      dismiss: '&',
    },
  })
  .service('Table', TableService)
  .service('Confirm', ConfirmService)
  .service('Reservation', ReservationService)
  .service('ReservationPart', ReservationPartService)
  .name;
