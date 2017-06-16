export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('app.reservations', {
      url: '/reservations',
      template: require('./reservations.view.html'),
      controller: 'ReservationsCtrl',
      controllerAs: 'reservations'
    })
}
