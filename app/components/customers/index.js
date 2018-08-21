import angular from 'angular';
import modal from 'angular-ui-bootstrap/src/modal';
import angularUiRouter from '@uirouter/angularjs';
import satellizer from 'satellizer';

import controller from './customers.controller';
import view from './customers.view.html';

import customerMergeController from './merge/customers.merge.controller';
import CustomerService from './customer.service';
import scrollMore from '../../common/directives/scroll-more';
import Alphabet from '../../common/directives/alphabet';
import pageFilterFactory from '../../shared/page_filter/page_filter.factory';

import ReservationStatusService from '../../common/services/reservation_status.service';

import fixReservationsItemView from '../fix.reservations.item/fix.reservations.item.view.html';
import fixCustomersView from './fix.customers/fix.customers.view.html';


export default angular.module('customers', [angularUiRouter, satellizer, modal, Alphabet])
  .component('customers', {
    controller,
    controllerAs: 'ctrl',
    template: view,
  })
  .component('fixCustomers', {
    template: fixCustomersView,
  })
  .component('fixReservationsItem', {
    template: fixReservationsItemView,
  })
  .controller('CustomerMergeCtrl', customerMergeController)
  .service('CustomerService', CustomerService)
  .service('ReservationStatus', ReservationStatusService)
  .factory('PageFilterFactory', pageFilterFactory,
    ['Reservation', 'Customer', 'CustomerService', '$modal', 'moment'])
  .directive('scrollMore', scrollMore)
  .directive('alphabet', () => new Alphabet())
  .name;
