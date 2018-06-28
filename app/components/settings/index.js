import angular from 'angular';
import routing from './settings.route';
import controller from './settings.controller';
import generalRouting from './general/settings_general.route';
import generalController from './general/settings_general.controller';
import emailsRouting from './emails/settings_emails.route';
import emailsController from './emails/settings_emails.controller';
import tablesRouting from './tables/settings_tables.route';
import tablesController from './tables/settings_tables.controller';
import editEmailController from './emails/settings_emails.edit_email.controller';
import editSmsController from './emails/settings_emails.edit_sms.controller';
import newZoneController from './tables/settings_tables.new_zone.controller';
import editZoneController from './tables/settings_tables.edit_zone.controller';
import newTableGroupController from './tables/settings_tables.new_table_group.controller';
import editTableGroupController from './tables/settings_tables.edit_table_group.controller';
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
import lightspeedController from './lightspeed/settings_lightspeed.controller';
import lightspeedAuthController from './lightspeed/settings_lightspeed.auth.controller';
import lightspeedRouting from './lightspeed/settings_lightspeed.route';
import customerSettingsNamesRouting from
  './customer_settings_names/settings_customer_settings_names.route';
import customerSettingsNamesController from
  './customer_settings_names/settings_customer_settings_names.controller';
import newCustomerSettingsNamesController from
  './customer_settings_names/settings_customer_settings_names.new.controller';
import editCustomerSettingsNamesController from
  './customer_settings_names/settings_customer_settings_names.edit.controller';

export default angular.module('app.settings', [])
  .controller('SettingsEmailsEditEmailCtrl', editEmailController)
  .controller('SettingsEmailsEditSmsCtrl', editSmsController)
  .controller('SettingsTablesNewZoneCtrl', newZoneController)
  .controller('SettingsTablesEditZoneCtrl', editZoneController)
  .controller('SettingsTablesNewTableGroupCtrl', newTableGroupController)
  .controller('SettingsTablesEditTableGroupCtrl', editTableGroupController)
  .controller('SettingsProductsNewProductCtrl', newProductController)
  .controller('SettingsProductsLimitsCtrl', productLimitsController)
  .controller('SettingsProductsEditMinMaxCtrl', productEditMinMaxController)
  .controller('SettingsEmployeesItemCtrl', employeesItemController)
  .config(routing)
  .controller('SettingsCtrl', controller)
  .config(generalRouting)
  .controller('SettingsGeneralCtrl', generalController)
  .config(emailsRouting)
  .controller('SettingsEmailsCtrl', emailsController)
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
  .controller('SettingsLightspeedCtrl', lightspeedController)
  .controller('SettingsLightspeedAuthCtrl', lightspeedAuthController)
  .config(lightspeedRouting)
  .config(customerSettingsNamesRouting)
  .controller('SettingsCustomerSettingsNamesCtrl', customerSettingsNamesController)
  .controller('SettingsCustomerSettingsNamesEditCtrl', editCustomerSettingsNamesController)
  .controller('SettingsCustomerSettingsNamesNewCtrl', newCustomerSettingsNamesController)
  .factory('SettingsTablesZoneFactory', settingsTablesZoneFactory, ['AppConstants'])
  .name;
