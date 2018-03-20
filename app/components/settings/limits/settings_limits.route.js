export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('app.settings.limits', {
      url: '/limits',
      controller: 'SettingsLimitsCtrl',
      controllerAs: 'limits_settings',
      template: require('./settings_limits.view.html'),
    });
}
