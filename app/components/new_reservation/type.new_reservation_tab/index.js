import angular from 'angular';

import controller from './type.new_reservation_tab.controller';
import view from './type.new_reservation_tab.view.html';

export default angular.module('typeNewReservationTab', [])
  .component('typeNewReservationTab', {
    controller,
    controllerAs: 'ctrl',
    template: view,
    bindings: {
      type: '<',
      reservation: '=',
      selectTab: '&',
      pagination: '<',
      currentTabIndex: '<',
      socials: '<',
    },
  })
  .name;
