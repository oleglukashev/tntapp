import angular from 'angular';

import controller from './zone.new_reservation_tab.controller';
import view from './zone.new_reservation_tab.view.html';

export default angular.module('zoneNewReservationTab', [])
  .component('zoneNewReservationTab', {
    controller,
    controllerAs: 'ctrl',
    template: view,
    bindings: {
      type: '<',
      zones: '<',
      tables: '<',
      currentIndex: '<',
      selectedZone: '=',
      reservation: '=',
      selectTab: '&',
      pagination: '<',
      zoneTimeRanges: '<',
      currentTabIndex: '<',
    },
  })
  .name;
