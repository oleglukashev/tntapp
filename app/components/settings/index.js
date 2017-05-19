import angular              from 'angular';

import routing              from './settings.route';
import controller           from './settings.controller';

import general_routing      from './general/settings_general.route';
import general_controller   from './general/settings_general.controller';

import mails_routing        from './mails/settings_mails.route';
import mails_controller     from './mails/settings_mails.controller';

import tables_routing       from './tables/settings_tables.route';
import tables_controller    from './tables/settings_tables.controller';

import edit_mail_controller from './mails/settings_mails.edit_mail.controller';
import new_zone_controller  from './tables/settings_tables.new_zone.controller';

import limits_routing 			from './limits/settings_limits.route';
import limits_controller 		from './limits/settings_limits.controller';

import plugins_routing      from './plugins/settings_plugins.route';
import plugins_controller   from './plugins/settings_plugins.controller';

export default angular.module('app.settings', [])
	.controller('SettingsMailsEditMailCtrl', edit_mail_controller)
  .controller('SettingsTablesNewZoneCtrl', new_zone_controller)
	.config(routing)
	.controller('SettingsCtrl', controller)
	.config(general_routing)
  .controller('SettingsGeneralCtrl', general_controller)
  .config(mails_routing)
  .controller('SettingsMailsCtrl', mails_controller)
  .config(limits_routing)
  .controller('SettingsLimitsCtrl', limits_controller)
  .config(tables_routing)
  .controller('SettingsTablesCtrl', tables_controller)
  .config(plugins_routing)
  .controller('SettingsPluginsCtrl', plugins_controller)
  .name;
