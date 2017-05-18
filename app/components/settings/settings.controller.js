export default class SettingsCtrl {
  constructor($state, $stateParams, $window) {
    'ngInject';

    this.$state 			= $state;
    this.$stateParams = $stateParams;
    this.$window 			= $window;

    this.pages 				= {
    	'ALGEMEEN'               : 'app.settings.general',
    	'MAILS'		             : 'app.settings.mails',
        'PLEKKEN VRIJHOUDEN'     : 'app.settings.limits'
    };
  }
}