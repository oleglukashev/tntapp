import angular from 'angular';
import angularMoment from 'angular-moment';
import datepicker from 'angular-ui-bootstrap/src/datepicker';

import controller from './date.new_reservation_tab.controller';
import view from './date.new_reservation_tab.view.html';

import AppConstants from '../../../config.constants';
import ReservationService from '../../../common/services/reservation.service';
import datepickerDecorator from '../../../common/decorators/datepicker.decorator';

export default angular.module('dateNewReservationTab', [angularMoment, AppConstants, datepicker])
  .component('dateNewReservationTab', {
    controller,
    controllerAs: 'ctrl',
    template: view,
    bindings: {
      type: '<',
      products: '<',
      settings: '<',
      reservation: '=',
      zones: '<',
      zoneTimeRanges: '=',
      productWeekTimeRanges: '=',
      openTimeRanges: '=',
      productTimeRanges: '=',
      currentIndex: '<',
      selectTab: '&',
      pagination: '<',
      currentTabIndex: '<',
    },
  })
  .service('Reservation', ReservationService)
  .config(datepickerDecorator)
  .name;
