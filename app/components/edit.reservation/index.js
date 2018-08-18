import angular from 'angular';
import controller from './edit.reservation.controller';
import view from './edit.reservation.view.html';

import newReservationGroupFactory from '../new_reservation/new_reservation.group.factory';
import TimeRangeService from '../../common/services/time_range.service';
import ReservationPartService from '../../common/services/reservation_part.service';
import ReservationService from '../../common/services/reservation.service';
import ConfirmService from '../../common/services/confirm.service';
import SettingsService from '../../common/services/settings.service';
import ZoneService from '../../common/services/zone.service';
import ProductService from '../../common/services/product.service';
import TableService from '../../common/services/table.service';
import AvailabilityService from '../../common/services/availability.service';
import NotificationService from '../../common/services/notification.service';

import editUserMenuMainInfo from '../user_menu/edit.user_menu/edit.user_menu.main_info';
import editUserMenuAllergies from '../user_menu/edit.user_menu/edit.user_menu.allergies';
import editUserMenuNotes from '../user_menu/edit.user_menu/edit.user_menu.notes';
import editUserMenuPreferences from '../user_menu/edit.user_menu/edit.user_menu.preferences';

import AppConstants from '../../config.constants';
import moment from 'angular-moment';

export default angular.module('editReservation', [AppConstants, moment, editUserMenuMainInfo,
  editUserMenuAllergies, editUserMenuNotes, editUserMenuPreferences])
  .component('editReservationComponent', {
    controller,
    controllerAs: 'ctrl',
    template: view,
    bindings: {
      resolve: '<',
      dismiss: '&',
    },
  })
  .service('TimeRange', TimeRangeService)
  .service('Confirm', ConfirmService)
  .service('ReservationPart', ReservationPartService)
  .service('Reservation', ReservationService)
  .service('Settings', SettingsService)
  .service('Zone', ZoneService)
  .service('Product', ProductService)
  .service('Table', TableService)
  .service('Availability', AvailabilityService)
  .service('Notification', NotificationService)
  .factory('NewReservationGroupFactory', newReservationGroupFactory)
  .name;
