export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('app.settings.plugins', {
      url: '/plugins',
      controller: 'SettingsPluginCtrl',
      controllerAs: 'plugins_settings',
      template: require('./settings_plugins.view.html')
    })
}
