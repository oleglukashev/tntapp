import angular from 'angular';
import controller from './dashboard.charts.controller';
import view from './dashboard.charts.view.html';
import ChartsService from '../../../common/services/charts.service';
import ProductService from '../../../common/services/product.service';
import chartRating from './dashboard.charts.rating.directive';

export default angular.module('dashboardCharts', [])
  .component('dashboardCharts', {
    bindings: {
      reservations: '=',
    },
    controller,
    controllerAs: 'charts',
    template: view,
  })
  .service('Charts', ChartsService)
  .service('Product', ProductService)
  .directive('chartRating', () => new chartRating())
  .name;
