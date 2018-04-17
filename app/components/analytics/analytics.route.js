export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('app.analytics', {
      url: '/analytics',
      params: {
        productId: null,
      },
      template: require('./analytics.view.html'),
      controller: 'AnalyticsCtrl',
      controllerAs: 'analytics',
    });
}
