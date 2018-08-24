import angular from 'angular';
import angularMoment from 'angular-moment';

import controller from './time.new_reservation_tab.controller';
import view from './time.new_reservation_tab.view.html';

import TableService from '../../../common/services/table.service';

export default angular.module('timeNewReservationTab', [angularMoment])
  .component('timeNewReservationTab', {
    controller,
    controllerAs: 'ctrl',
    template: view,
    bindings: {
      type: '<',
      currentIndex: '<',
      reservation: '=',
      productWeekTimeRanges: '=',
      selectTab: '&',
      pagination: '<',
      currentCompanyId: '<',
      currentTabIndex: '<',
      warnings: '<'
    },
  })
  .service('Table', TableService)
  .name;
