routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('app.dashboard', {
      url: '/dashboard',
      template: require('./dashboard.view.html'),
      controller: 'DashboardCtrl',
      controllerAs: 'dash'
    })
}