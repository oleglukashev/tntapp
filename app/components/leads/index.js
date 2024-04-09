import angularMoment from 'angular-moment';
import 'md-date-range-picker/dist/md-date-range-picker.js';
import 'md-date-range-picker/dist/md-date-range-picker.css'
import modal from 'angular-ui-bootstrap/src/modal';
import view from './leads.view.html';
import controller from './leads.controller';
import ReservationStatusService from '../../common/services/reservation_status.service';
import ZoneService from '../../common/services/zone.service';
import ReservationService from '../../common/services/reservation.service';
import ProductService from '../../common/services/product.service';
import TimeRangeService from '../../common/services/time_range.service';
import pageFilterFactory from '../../shared/page_filter/page_filter.factory';
import ReservationItemService from '../reservation.item/reservation.item.service';
import reservationItem from '../reservation.item';


export default angular.module('leads', [
  modal,
  angularMoment,
  'ngMaterialDateRangePicker',
  reservationItem,
  ])
  .component('leads', {
    controller,
    controllerAs: 'ctrl',
    template: view,
  })
  .service('ReservationStatus', ReservationStatusService)
  .service('Zone', ZoneService)
  .service('Reservation', ReservationService)
  .service('ReservationItem', ReservationItemService)
  .service('Product', ProductService)
  .service('TimeRange', TimeRangeService)
  .factory('PageFilterFactory', pageFilterFactory)
  .name;