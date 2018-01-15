export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('customer_reservation', {
      template: '<div ui-view></div>',
    })
    .state('customer_reservation.new', {
      url: '/reservation/:id?date&aantal_personen',
      template: require('./customer_reservation.view.html'),
      controller: 'CustomerReservationCtrl',
      controllerAs: 'customer_reserv'
    })
    .state('customer_reservation.alternative', {
      url: '/thenexttable-embed/iframe.php?rid&date&aantal_personen',
      controller: 'CustomerReservationCtrl'
    })
    .state('customer_reservation.alternative_start', {
      url: '/index.php/reservering/:id/start?date&aantal_personen',
      controller: 'CustomerReservationCtrl'
    })
}
