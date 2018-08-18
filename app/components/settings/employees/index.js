import angular from 'angular';
import modal from 'angular-ui-bootstrap/src/modal';
import controller from './settings_employees.controller';
import view from './settings_employees.view.html';

import EmployeeService from '../../../common/services/employee.service';

import fixSettingsItemView from '../../fix.settings.item/fix.settings.item.view.html';
import menu from '../menu';

export default angular.module('employeesSettings', [modal, menu])
  .component('employeesSettings', {
    controller,
    controllerAs: 'ctrl',
    template: view,
  })
  .component('fixSettingsItem', {
    template: fixSettingsItemView,
  })
  .service('Employee', EmployeeService)
  .name;
