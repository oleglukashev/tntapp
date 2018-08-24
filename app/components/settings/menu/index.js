import angular from 'angular';
import controller from './menu.controller';
import view from './menu.view.html';

import ReservationStatusService from '../../../common/services/reservation_status.service';
import UntillService from '../../../common/services/untill.service';

export default angular.module('settingsMenu', [])
  .component('settingsMenu', {
    controller,
    controllerAs: 'ctrl',
    template: view,
  })
  .service('ReservationStatus', ReservationStatusService)
  .service('Untill', UntillService)
  .name;
