import angular from 'angular';
import accordion from 'angular-ui-bootstrap/src/accordion';
import buttons from 'angular-ui-bootstrap/src/buttons';
import modal from 'angular-ui-bootstrap/src/modal';
import rzModule from 'angularjs-slider';

import controller from './settings_products.controller';
import view from './settings_products.view.html';

import TimeRangeService from '../../../common/services/time_range.service';
import ProductService from '../../../common/services/product.service';
import SliderService from '../../../common/services/slider.service';

import fixSettingsItemView from '../../fix.settings.item/fix.settings.item.view.html';
import menu from '../menu';

export default angular.module('productsSettings', [accordion, modal, buttons, rzModule, menu])
  .component('productsSettings', {
    controller,
    controllerAs: 'ctrl',
    template: view,
  })
  .component('fixSettingsItem', {
    template: fixSettingsItemView,
  })
  .service('TimeRange', TimeRangeService)
  .service('Product', ProductService)
  .service('Slider', SliderService)
  .name;
