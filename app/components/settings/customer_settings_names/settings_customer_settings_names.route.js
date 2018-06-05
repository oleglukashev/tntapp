export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('app.settings.customer_settings_names', {
      url: '/settings_names',
      controller: 'SettingsCustomerSettingsNamesCtrl',
      controllerAs: 'settings_names',
      template: require('./settings_customer_settings_names.view.html'),
    });
}
