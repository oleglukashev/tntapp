import angular from 'angular';

import controller from './number_of_persons.new_reservation_tab.controller';
import view from './number_of_persons.new_reservation_tab.view.html';

import ReservationService from '../../../common/services/reservation.service';

export default angular.module('numberOfPersonsNewReservationTab', [])
  .component('numberOfPersonsNewReservationTab', {
    controller,
    controllerAs: 'ctrl',
    template: view,
    bindings: {
      type: '<',
      tables: '<',
      reservation: '=',
      currentIndex: '<',
      clearAndLoadTime: '&',
      selectTab: '&',
      pagination: '<',
      currentTabIndex: '<',
    },
  })
  .service('Reservation', ReservationService)
  .name;
