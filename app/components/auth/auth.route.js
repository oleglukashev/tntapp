export default function routes($stateProvider, $httpProvider) {
  'ngInject';

  $stateProvider
    .state('auth', {
      templateUrl: 'login.html'
    })

    .state('auth.login', {
      url: '/login',
      controller: 'AuthCtrl',
      controllerAs: 'auth',
      template: require('./auth.view.html'),
      resolve: {
        auth: function(User) {
          return User.ensureAuthIs(false);
        }
      }
    })

    .state('auth.register', {
      url: '/register',
      controller: 'AuthCtrl',
      controllerAs: 'auth',
      template: require('./auth.view.html'),
      resolve: {
        auth: function(User) {
          return User.ensureAuthIs(false);
        }
      }
    });
}
