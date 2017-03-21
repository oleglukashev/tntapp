import authInterceptor from './config.interceptor'

export default function routes($stateProvider, $urlRouterProvider, $httpProvider) {
  'ngInject';

  $httpProvider.interceptors.push(authInterceptor);

  $stateProvider
    .state('app', {
      abstract: true,
      templateUrl: 'app.html',
      resolve: {
        auth: function(User) {
          return User.ensureAuthIs(false);
        }
      }
    });

  $urlRouterProvider.otherwise('/');
}
