export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('app.dashboard', {
      url: '/',
      template: require('./dashboard.view.html'),
      controller: 'DashboardCtrl',
      controllerAs: 'dash'
    })
}
