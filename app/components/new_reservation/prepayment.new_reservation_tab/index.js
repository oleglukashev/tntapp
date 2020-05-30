import angular from 'angular';
import angularMoment from 'angular-moment';

import controller from './prepayment.new_reservation_tab.controller';
import view from './prepayment.new_reservation_tab.view.html';

export default angular.module('prepaymentNewReservationTab', [])
  .component('prepaymentNewReservationTab', {
    controller,
    controllerAs: 'ctrl',
    template: view,
    bindings: {
      type: '<',
      currentIndex: '<',
      reservation: '=',
      selectTab: '&',
      settings: '<',
      pagination: '<',
      currentTabIndex: '<',
      errors: '=',
    },
  })
  .name;
