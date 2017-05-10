export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('app.settings', {
      url: '/settings',
      controller: 'SettingsCtrl',
      controllerAs: 'settings',
      template: require('./settings.view.html')
    })
}
