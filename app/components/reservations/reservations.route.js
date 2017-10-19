export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('app.reservations', {
      url: '/reservations',
      params: {
        productId: 0,
      },
      template: require('./reservations.view.html'),
      controller: 'ReservationsCtrl',
      controllerAs: 'reservations',
    });
}
