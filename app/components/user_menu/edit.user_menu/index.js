import angular from 'angular';
import modal from 'angular-ui-bootstrap/src/modal';
import controller from './edit.user_menu.controller';
import view from './edit.user_menu.view.html';

import userMenuService from '../user_menu.service';
import customerService from '../../../common/services/customer.service';
import reservationService from '../../../common/services/reservation.service';
import reservationPartService from '../../../common/services/reservation_part.service';

import editUserMenuMainInfo from './edit.user_menu.main_info';
import editUserMenuAllergies from './edit.user_menu.allergies';
import editUserMenuNotes from './edit.user_menu.notes';
import editUserMenuPreferences from './edit.user_menu.preferences';

import phoneValidDirective from '../../../common/directives/phone-valid.directive';

export default angular.module('editUserMenu', [
    editUserMenuMainInfo,
    editUserMenuAllergies,
    editUserMenuNotes,
    editUserMenuPreferences,
    modal,
  ])
  .component('editUserMenu', {
    controller,
    controllerAs: 'ctrl',
    template: view,
    bindings: {
      dismiss: '&',
    }
  })
  .service('UserMenu', userMenuService)
  .service('Customer', customerService)
  .service('Reservation', reservationService)
  .service('ReservationPart', reservationPartService)
  .directive('phoneValid', phoneValidDirective)
  .name;
