import angular from 'angular';
import angulatMoment from 'angular-moment';

import controller from './product.new_reservation_tab.controller';
import view from './product.new_reservation_tab.view.html';

import ReservationService from '../../../common/services/reservation.service';

export default angular.module('productNewReservationTab', [angulatMoment])
  .component('productNewReservationTab', {
    controller,
    controllerAs: 'ctrl',
    template: view,
    bindings: {
      type: '<',
      products: '<',
      reservation: '=',
      warnings: '<',
      productWeekTimeRanges: '=',
      openTimeRanges: '=',
      productTimeRanges: '=',
      currentIndex: '<',
      clearAndLoadTime: '&',
      selectTab: '&',
      pagination: '<',
      currentTabIndex: '<',
    },
  })
  .service('Reservation', ReservationService)
  .name;
