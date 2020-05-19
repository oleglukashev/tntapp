import angular from 'angular';
import angularMoment from 'angular-moment';

import controller from './corona.new_reservation_tab.controller';
import view from './corona.new_reservation_tab.view.html';

export default angular.module('coronaNewReservationTab', [])
  .component('coronaNewReservationTab', {
    controller,
    controllerAs: 'ctrl',
    template: view,
    bindings: {
      type: '<',
      currentIndex: '<',
      reservation: '=',
      selectTab: '&',
      pagination: '<',
      currentTabIndex: '<',
    },
  })
  .name;
