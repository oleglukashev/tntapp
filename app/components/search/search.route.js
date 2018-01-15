export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('app.search', {
      url: '/search',
      controller: 'SearchCtrl',
      controllerAs: 'search',
      template: require('./search.results.view.html'),
      params: {
        reservations: null,
      },
    });
}
