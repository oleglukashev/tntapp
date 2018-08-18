import angular from 'angular';
import modal from 'angular-ui-bootstrap/src/modal';
import chartjs from 'angular-chart.js';
import uiLoad from '../../common/services/ui-load';
import uiJq from '../../common/directives/ui-jq';

import controller from './analytics.controller';
import view from './analytics.view.html';

import AnalyticsService from '../../common/services/analytics.service';
import ReservationStatusService from '../../common/services/reservation_status.service';
import ChartsService from '../../common/services/charts.service';
import ProductService from '../../common/services/product.service';

import fixAnalyticsView from './fix.analytics/fix.analytics.view.html';

export default angular.module('analytics', [modal, chartjs, uiLoad, uiJq])
  .component('fixAnalytics', {
    template: fixAnalyticsView,
  })
  .component('analytics', {
    controller,
    controllerAs: 'ctrl',
    template: view,
  })
  .service('Analytics', AnalyticsService)
  .service('Charts', ChartsService)
  .service('ReservationStatus', ReservationStatusService)
  .service('Product', ProductService)
  .config(['ChartJsProvider', (ChartJsProvider) => {
    ChartJsProvider.setOptions({
      chartColors: ['#303e4d', '#787878', '#ff9800'],
      responsive: true,
    });
  }])
  .name;
