import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './customer.route';
import controller from './customer.controller';
import customerMergeController from './merge/customer.merge.controller';
import CustomerService from './customer.service';
import scrollMore from '../../common/directives/scroll-more';
import pageFilterFactory from '../../shared/page_filter/page_filter.factory';

export default angular.module('app.customers', [uirouter])
  .config(routing)
  .controller('CustomerCtrl', controller)
  .controller('CustomerMergeCtrl', customerMergeController)
  .service('CustomerService', CustomerService)
  .factory('PageFilterFactory', pageFilterFactory,
    ['Reservation', 'Customer', 'CustomerService', '$modal', 'moment'])
  .directive('scrollMore', scrollMore)
  .name;
