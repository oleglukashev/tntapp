export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('app.dashboard', {
      url: '/?sender_email_token',
      template: require('./dashboard.view.html'),
      controller: 'DashboardCtrl',
      controllerAs: 'dash'
    })
}
