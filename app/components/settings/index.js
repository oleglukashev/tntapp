import angular    				from 'angular';

import routing 						from './settings.route';
import controller 				from './settings.controller';

import general_routing 		from './general/settings_general.route';
import general_controller from './general/settings_general.controller';

export default angular.module('app.settings', [])
	.config(routing)
	.controller('SettingsCtrl', controller)
	.config(general_routing)
  .controller('SettingsGeneralCtrl', general_controller)
  .name;
