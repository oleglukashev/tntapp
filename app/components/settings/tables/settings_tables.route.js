export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('app.settings.tables', {
      url: '/tables',
      controller: 'SettingsTablesCtrl',
      controllerAs: 'tables_settings',
      template: require('./settings_tables.view.html')
    })
}
