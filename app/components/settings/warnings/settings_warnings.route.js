export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('app.settings.warnings', {
      url: '/warnings',
      controller: 'SettingsWarningsCtrl',
      controllerAs: 'warnings_settings',
      template: require('./settings_warnings.view.html'),
    });
}
