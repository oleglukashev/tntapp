import angular from 'angular';

import controller from './person.new_reservation_tab.controller';
import view from './person.new_reservation_tab.view.html';

import nameController from './name.new_reservation.controller';
import nameView from './name.new_reservation.view.html';

import preferencesController from './preferences.new_reservation.controller';
import preferencesView from './preferences.new_reservation.view.html';

import CustomerService from '../../../common/services/customer.service';
import CustomerSettingsNameService from '../../../common/services/customer_settings_name.service';
import phoneValidDirective from '../../../common/directives/phone-valid.directive';
import TimeRangeService from '../../../common/services/time_range.service';
import NewReservationService from '../../new_reservation/new_reservation.service';
import TableService from '../../../common/services/table.service';
import ProductService from '../../../common/services/product.service';
import AvailabilityService from '../../../common/services/availability.service';

import AppConstants from '../../../config.constants';

export default angular.module('personNewReservationTab', [AppConstants])
  .component('personNewReservationTab', {
    controller,
    controllerAs: 'ctrl',
    template: view,
    bindings: {
      type: '<',
      reservation: '=',
      currentIndex: '<',
      settings: '<',
      selectTab: '&',
      validatePerson: '&',
      pagination: '<',
      currentTabIndex: '<',
      currentCompanyId: '<',
      allergyData: '=',
      preferenceData: '=',
      preferenceIsValid: '&',
      prepaymentIsEnabled: '&',
      allergyIsValid: '&',
      addAllergy: '&',
      addPreference: '&',
      form: '=',
      errors: '=',
    },
  })
  .component('nameNewReservation', {
    controller: nameController,
    controllerAs: 'ctrl',
    template: nameView,
    bindings: {
      currentCompanyId: '<',
      reservation: '=',
    },
  })
  .component('preferencesNewReservation', {
    controller: preferencesController,
    controllerAs: 'ctrl',
    template: preferencesView,
    bindings: {
      currentCompanyId: '<',
      reservation: '=',
      allergyData: '=',
      preferenceData: '=',
      preferenceIsValid: '&',
      allergyIsValid: '&',
      addAllergy: '&',
      addPreference: '&',
    },
  })
  .service('Customer', CustomerService)
  .service('CustomerSettingsName', CustomerSettingsNameService)
  .service('TimeRange', TimeRangeService)
  .service('NewReservation', NewReservationService)
  .service('Table', TableService)
  .service('Product', ProductService)
  .service('Availability', AvailabilityService)
  .directive('phoneValid', phoneValidDirective)
  .name;
