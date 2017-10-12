import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './search.route';
import controller from './search.controller';
import factory from './search.factory';
import reservationStatusMenuFactory from '../../shared/reservation_status_menu/reservation_status_menu.factory';

export default angular.module('app.search', [uirouter])
  .config(routing)
  .controller('SearchCtrl', controller)
  .factory('SearchFactory', factory)
  .factory('ReservationStatusMenu', reservationStatusMenuFactory,
    ['ReservationStatus', 'filterFilter', 'moment', '$modal'])
  .name;
