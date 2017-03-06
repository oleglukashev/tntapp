routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('app.dashboard', {
      url: '/dashboard',
      views: {
        '': {
          template: 'dashboardView.html'
        }
      }
    });
}