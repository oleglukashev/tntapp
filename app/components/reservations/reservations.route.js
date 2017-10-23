export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('app.reservations', {
      url: '/reservations',
      params: {
        productId: null,
      },
      template: require('./reservations.view.html'),
      controller: 'ReservationsCtrl',
      controllerAs: 'reservations',
    });
}
