import angular from 'angular';
import modal from 'angular-ui-bootstrap/src/modal';
import accordion from 'angular-ui-bootstrap/src/accordion';
import angularMoment from 'angular-moment';
import uiLoad from '../../common/services/ui-load';
import uiJq from '../../common/directives/ui-jq';

import rzModule from 'angularjs-slider';
import dnd from '../../shared/dnd';
import dndLists from '../../common/directives/angular-drag-and-drop-lists.directive';

import controller from './agenda.controller';
import view from './agenda.view.html';

import walkInController from './walk_in/agenda_walk_in.controller';
import pageFilterFactory from '../../shared/page_filter/page_filter.factory';
import agendaChartsController from './charts/agenda_charts.controller';

import fixAgendaChartsView from './fix.agenda.charts/fix.agenda.charts.view.html';
import fixReservationsItemView from '../fix.reservations.item/fix.reservations.item.view.html';
import fixAgendaReservationsView
  from './fix.agenda.reservations/fix.agenda.reservations.view.html';

import ReservationItemService from '../reservation.item/reservation.item.service';
import TimeRangeService from '../../common/services/time_range.service';
import ReservationStatusService from '../../common/services/reservation_status.service';
import ZoneService from '../../common/services/zone.service';
import TableService from '../../common/services/table.service';
import ProductService from '../../common/services/product.service';
import SliderService from '../../common/services/slider.service';
import PageFilterTimeRangeService from '../../common/services/page_filter_time_range.service';
import ChartsService from '../../common/services/charts.service';
import OrderByTimeAndRestaurantIdFilter from '../../common/filters/time_reservation_id_sort.filter';

import pageFilterTimeRangesController
  from '../../shared/page_filter/time_ranges/page_filter_time_ranges.controller';

import reservationItem from '../reservation.item';

export default angular.module('agenda', [
  modal,
  accordion,
  angularMoment,
  reservationItem,
  OrderByTimeAndRestaurantIdFilter,
  uiLoad,
  rzModule,
  uiJq,
  dnd,
  dndLists])
  .component('agenda', {
    controller,
    controllerAs: 'ctrl',
    template: view,
  })
  .component('fixAgendaReservations', {
    template: fixAgendaReservationsView,
  })
  .component('fixAgendaCharts', {
    template: fixAgendaChartsView,
  })
  .component('fixReservationsItem', {
    template: fixReservationsItemView,
  })
  .controller('AgendaWalkInCtrl', walkInController)
  .controller('AgendaChartsCtrl', agendaChartsController)
  .controller('PageFilterTimeRangesCtrl', pageFilterTimeRangesController)
  .factory('PageFilterFactory', pageFilterFactory)
  .service('ReservationItem', ReservationItemService)
  .service('TimeRange', TimeRangeService)
  .service('ReservationStatus', ReservationStatusService)
  .service('Zone', ZoneService)
  .service('Table', TableService)
  .service('Product', ProductService)
  .service('PageFilterTimeRange', PageFilterTimeRangeService)
  .service('Charts', ChartsService)
  .service('Slider', SliderService)
  .name;
