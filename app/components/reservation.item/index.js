import angular from 'angular';
import controller from './reservation.item.controller';
import view from './reservation.item.view.html';
import agendaReservationView from './reservation.agenda.item.view.html';
import agendaCalendarReservationView from './reservation.agenda.calendar.item.view.html';
import leadReservationView from './reservation.lead.item.view.html';
import ReservationStatusService from '../../common/services/reservation_status.service';
import ReservationService from '../../common/services/reservation.service';

import AppConstants from '../../config.constants';
import moment from 'angular-moment';

export default angular.module('reservationItem', [AppConstants, moment])
  .component('reservationItem', {
    controller,
    controllerAs: 'ctrl',
    template: view,
    bindings: {
      data: '=',
      hideIcon: '=',
      showDate: '=',
      changeStatus: '&',
    },
  })
  .component('leadReservationItem', {
    controller,
    controllerAs: 'ctrl',
    template: leadReservationView,
    bindings: {
      data: '=',
      hideIcon: '=',
      showDate: '=',
      changeStatus: '&',
    },
  })
  .component('agendaReservationItem', {
    controller,
    controllerAs: 'ctrl',
    template: agendaReservationView,
    bindings: {
      data: '=',
      hideIcon: '=',
      showDate: '=',
      changeStatus: '&',
    },
  })
  .component('agendaCalendarReservationItem', {
    controller,
    controllerAs: 'ctrl',
    template: agendaCalendarReservationView,
    bindings: {
      data: '=',
      changeStatus: '&',
    },
  })
  .service('Reservation', ReservationService)
  .service('ReservationStatus', ReservationStatusService)
  .name;
