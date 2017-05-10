import angular    					from 'angular';

import routing 							from './settings.route';
import controller 					from './settings.controller';

import general_routing 			from './general/settings_general.route';
import general_controller 	from './general/settings_general.controller';

import mails_routing 				from './mails/settings_mails.route';
import mails_controller 		from './mails/settings_mails.controller';

import edit_mail_controller from './mails/settings_mails.edit_mail.controller';

export default angular.module('app.settings', [])
	.controller('SettingsMailsEditMailCtrl', edit_mail_controller)
	.config(routing)
	.controller('SettingsCtrl', controller)
	.config(general_routing)
  .controller('SettingsGeneralCtrl', general_controller)
  .config(mails_routing)
  .controller('SettingsMailsCtrl', mails_controller)
  .name;
