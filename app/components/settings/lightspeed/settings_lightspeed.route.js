export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('app.settings.lightspeed', {
      url: '/lightspeed',
      component: 'lightspeedSettings',
    });
}
