export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('app.settings.employees', {
      url: '/employees',
      controller: 'SettingsEmployeesCtrl',
      controllerAs: 'employees_settings',
      template: require('./settings_employees.view.html')
    })
}
