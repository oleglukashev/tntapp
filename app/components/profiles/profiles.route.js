export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('app.profiles', {
      url: '/profiles',
      template: require('./profiles.view.html'),
      controller: 'ProfilesCtrl',
      controllerAs: 'profiles'
    })
}
