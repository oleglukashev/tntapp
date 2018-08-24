import angular from 'angular';
import controller from './dashboard.reservations.controller';
import view from './dashboard.reservations.view.html';
import UserService from '../../../common/services/user.service';
import ZoneService from '../../../common/services/zone.service';
import TableService from '../../../common/services/table.service';
import UserMenuService from '../../../components/user_menu/user_menu.service';
import ReservationStatusService from '../../../common/services/reservation_status.service';
import ReservationItemService from '../../reservation.item/reservation.item.service';

export default angular.module('dashboardReservations', [])
  .component('dashboardReservations', {
    bindings: {
      reservations: '<',
      zones: '<',
    },
    controller,
    controllerAs: 'ctrl',
    template: view,
  })
  .service('User', UserService)
  .service('UserMenu', UserMenuService)
  .service('ReservationStatus', ReservationStatusService)
  .service('ReservationItem', ReservationItemService)
  .service('Zone', ZoneService)
  .service('Table', TableService)
  .name;



