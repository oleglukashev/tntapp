import angular from 'angular';
import angularUiRouter from '@uirouter/angularjs';
import modal from 'angular-ui-bootstrap/src/modal';

import decorator from './search.decorator';
import controller from './search.controller';
import view from './search.results.view.html';

import pageFilterFactory from '../../shared/page_filter/page_filter.factory';
import reservationStatusMenuFactory from '../../shared/reservation_status_menu/reservation_status_menu.factory';
import TableService from '../../common/services/table.service';
import ZoneService from '../../common/services/zone.service';
import ProductService from '../../common/services/product.service';
import ReservationStatusService from '../../common/services/reservation_status.service';
import ReservationItemService from '../reservation.item/reservation.item.service';

import reservationItem from '../reservation.item';

export default angular.module('search', [angularUiRouter, modal, reservationItem])
  .component('search', {
    controller,
    controllerAs: 'ctrl',
    template: view,
  })
  .config(decorator)
  .service('Table', TableService)
  .service('Zone', ZoneService)
  .service('Product', ProductService)
  .service('ReservationStatus', ReservationStatusService)
  .service('ReservationItem', ReservationItemService)
  .factory('PageFilterFactory', pageFilterFactory,
    ['AppConstants', 'Reservation', 'Customer', '$uibModal', '$filter', 'moment', 'filterFilter'])
  .name;
