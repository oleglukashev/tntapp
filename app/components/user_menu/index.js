import angular from 'angular';
import modal from 'angular-ui-bootstrap/src/modal';
import controller from './user_menu.controller';
import view from './user_menu.view.html';

import userMenuService from './user_menu.service';
import customerService from '../../common/services/customer.service';
import reservationService from '../../common/services/reservation.service';
import reservationPartService from '../../common/services/reservation_part.service';
import TniService from '../../common/services/tni.service';

export default angular.module('UserMenu', [modal])
  .component('userMenu', {
    controller,
    controllerAs: 'ctrl',
    template: view,
  })
  .service('UserMenu', userMenuService)
  .service('Customer', customerService)
  .service('Reservation', reservationService)
  .service('ReservationPart', reservationPartService)
  .service('Tni', TniService)
  .name;
