export default function routes($stateProvider,   $urlRouterProvider) {
  'ngInject';

  $stateProvider
    .state('app', {
      abstract: true,
      template: require('./components/layout/app.html'),
      resolve: {
        auth: function(User) {
          alert(User);
          return User.verifyAuth();
        }
      }
    });

  $urlRouterProvider.otherwise('/');
}
