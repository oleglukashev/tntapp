import template from './settings_lightspeed.view.html';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('app.settings.lightspeed', {
      url: '/lightspeed',
      controller: 'SettingsLightspeedCtrl',
      controllerAs: 'lightspeed_settings',
      template,
    });
}
