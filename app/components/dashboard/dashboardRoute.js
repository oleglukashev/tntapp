routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('app.dashboard', {
      url: '/dashboard',
      template: require('./dashboardView.html'),
      controller: 'DashboardCtrl'
    })
}