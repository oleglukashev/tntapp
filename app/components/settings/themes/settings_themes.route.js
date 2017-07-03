export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('app.settings.themes', {
      url: '/themes',
      controller: 'SettingsThemesCtrl',
      controllerAs: 'themes_settings',
      template: require('./settings_themes.view.html')
    })
}
