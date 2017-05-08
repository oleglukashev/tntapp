export default function routes($stateProvider, $httpProvider) {
  'ngInject';

  $stateProvider
    .state('auth', {
      templateUrl: 'login.html',
      resolve: {
        auth: function(User) {
          return User.ensureAuthForLoginPages();
        }
      }
    })

    .state('auth.login', {
      url: '/login',
      controller: 'AuthCtrl',
      controllerAs: 'auth',
      template: require('./auth.view.html')
    })

    .state('auth.register', {
      url: '/register',
      controller: 'AuthCtrl',
      controllerAs: 'auth',
      template: require('./auth.view.html')
    })

    .state('auth.reset_password', {
        url: '/reset_password',
        controller: 'AuthCtrl',
        controllerAs: 'auth',
        template: require('./auth.reset_password.view.html')
    })

    .state('auth.reset_password_finish', {
        url: '/reset_password/:id/:token',
        controller: 'AuthCtrl',
        controllerAs: 'auth',
        template: require('./auth.reset_password.view.html')
    });
}
