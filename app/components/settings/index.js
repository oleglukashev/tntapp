import angular from 'angular';
import routing from './settings.route';
import controller from './settings.controller';
import generalRouting from './general/settings_general.route';
import generalController from './general/settings_general.controller';
import mailsRouting from './mails/settings_mails.route';
import mailsController from './mails/settings_mails.controller';
import tablesRouting from './tables/settings_tables.route';
import tablesController from './tables/settings_tables.controller';
import editMailController from './mails/settings_mails.edit_mail.controller';
import newZoneController from './tables/new_zone/settings_tables.new_zone.controller';
import editZoneController from './tables/edit_zone/settings_tables.edit_zone.controller';
import settingsTablesZoneFactory from './tables/settings_tables.zone.factory';
import limitsRouting from './limits/settings_limits.route';
import limitsController from './limits/settings_limits.controller';
import productsRouting from './products/settings_products.route';
import productsController from './products/settings_products.controller';
import productLimitsController from './products/settings_products.limits.controller';
import productEditMinMaxController from './products/settings_products.edit_minmax.controller';
import newProductController from './products/settings_products.new_product.controller';
import pluginsRouting from './plugins/settings_plugins.route';
import pluginsController from './plugins/settings_plugins.controller';
import employeesRouting from './employees/settings_employees.route';
import employeesController from './employees/settings_employees.controller';
import employeesItemController from './employees/settings_employees.item.controller';
import themesRouting from './themes/settings_themes.route';
import themesController from './themes/settings_themes.controller';
import warningsRouting from './warnings/settings_warnings.route';
import warningsController from './warnings/settings_warnings.controller';
import editWarningsController from './warnings/edit/settings_warnings.edit.controller';

export default angular.module('app.settings', [])
  .controller('SettingsMailsEditMailCtrl', editMailController)
  .controller('SettingsTablesNewZoneCtrl', newZoneController)
  .controller('SettingsTablesEditZoneCtrl', editZoneController)
  .controller('SettingsProductsNewProductCtrl', newProductController)
  .controller('SettingsProductsLimitsCtrl', productLimitsController)
  .controller('SettingsProductsEditMinMaxCtrl', productEditMinMaxController)
  .controller('SettingsEmployeesItemCtrl', employeesItemController)
  .config(routing)
  .controller('SettingsCtrl', controller)
  .config(generalRouting)
  .controller('SettingsGeneralCtrl', generalController)
  .config(mailsRouting)
  .controller('SettingsMailsCtrl', mailsController)
  .config(limitsRouting)
  .controller('SettingsLimitsCtrl', limitsController)
  .config(tablesRouting)
  .controller('SettingsTablesCtrl', tablesController)
  .config(pluginsRouting)
  .controller('SettingsPluginsCtrl', pluginsController)
  .config(productsRouting)
  .controller('SettingsProductsCtrl', productsController)
  .config(employeesRouting)
  .controller('SettingsEmployeesCtrl', employeesController)
  .config(themesRouting)
  .controller('SettingsThemesCtrl', themesController)
  .config(warningsRouting)
  .controller('SettingsWarningsCtrl', warningsController)
  .controller('SettingsWarningsEditCtrl', editWarningsController)
  .factory('SettingsTablesZoneFactory', settingsTablesZoneFactory, ['AppConstants'])
  .name;
