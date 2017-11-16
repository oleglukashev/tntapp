export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('customer_reservation', {
      template: '<div ui-view></div>',
    })
    .state('customer_reservation.new', {
      url: '/reservation/:id',
      template: require('./customer_reservation.view.html'),
      controller: 'CustomerReservationCtrl',
      controllerAs: 'customer_reserv'
    })
}
