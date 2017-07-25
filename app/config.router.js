export default function routes($stateProvider, $urlRouterProvider) {
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
}
