export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('app.settings.mails', {
      url: '/mails',
      controller: 'SettingsMailsCtrl',
      controllerAs: 'mails_settings',
      template: require('./settings_mails.view.html')
    })
}
