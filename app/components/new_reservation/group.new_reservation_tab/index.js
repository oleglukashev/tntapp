import angular from 'angular';
import angularMoment from 'angular-moment';

import controller from './group.new_reservation_tab.controller';
import view from './group.new_reservation_tab.view.html';

import ReservationPartService from '../../../common/services/reservation_part.service';

export default angular.module('groupNewReservationTab', [angularMoment])
  .component('groupNewReservationTab', {
    controller,
    controllerAs: 'ctrl',
    template: view,
    bindings: {
      type: '<',
      currentIndex: '<',
      reservation: '=',
      selectTab: '&',
      selectCurrentIndex: '&',
      pagination: '<',
      currentTabIndex: '<',
    },
  })
  .service('ReservationPart', ReservationPartService)
  .name;
