export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('app.settings.emails', {
      url: '/emails',
      controller: 'SettingsEmailsCtrl',
      controllerAs: 'emails_settings',
      template: require('./settings_emails.view.html')
    })
}
