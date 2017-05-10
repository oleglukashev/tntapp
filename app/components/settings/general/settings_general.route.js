export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('app.settings.general', {
      url: '/general',
      controller: 'SettingsGeneralCtrl',
      controllerAs: 'general_settings',
      template: require('./settings_general.view.html')
    })
}
