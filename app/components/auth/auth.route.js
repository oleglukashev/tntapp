export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('auth', {
      templateUrl: 'login.html',
      resolve: {
        auth: User => User.ensureAuthForLoginPages(),
      },
    })

    .state('auth.login', {
      url: '/login',
      controller: 'AuthCtrl',
      controllerAs: 'auth',
      template: require('./auth.view.html'),
    })

    .state('auth.register', {
      url: '/register',
      controller: 'AuthCtrl',
      controllerAs: 'auth',
      template: require('./auth.view.html'),
    })

    .state('auth.reset_password', {
      url: '/reset_password',
      controller: 'AuthCtrl',
      controllerAs: 'auth',
      template: require('./auth.reset_password.view.html'),
    })

    .state('auth.reset_password_finish', {
      url: '/reset_password/:id/:token',
      controller: 'AuthCtrl',
      controllerAs: 'auth',
      template: require('./auth.reset_password.view.html'),
    })

    .state('auth.activate', {
      url: '/activate/:id/:token',
      controller: 'AuthCtrl',
      controllerAs: 'auth',
      template: require('./auth.activate.view.html'),
    })

    .state('auth_admin', {
      templateUrl: 'login.html',
    })

    .state('auth_admin.login_via_admin', {
      url: '/login_via_admin/:token',
      controller: 'AuthCtrl',
      controllerAs: 'auth',
      template: require('./auth.admin_view.html'),
    });
}
