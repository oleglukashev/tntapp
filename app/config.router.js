routes.$inject = ['$stateProvider', '$urlRouterProvider'];

export default function routes($stateProvider,   $urlRouterProvider) {
  $urlRouterProvider.otherwise('/app/dashboard');

  $stateProvider
    .state('app', {
      abstract: true,
      url: '/app',
      template: require('./components/layout/app.html')
    });
}