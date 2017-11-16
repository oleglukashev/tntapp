export default function routes($stateProvider, $urlRouterProvider, $locationProvider) {
  'ngInject';

  $stateProvider
    .state('app', {
      abstract: true,
      templateUrl: 'app.html',
      resolve: {
        auth: User => User.ensureAuthForClosedPages(),
      },
    });

  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false,
  });
}
