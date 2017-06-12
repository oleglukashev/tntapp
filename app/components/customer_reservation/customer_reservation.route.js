export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('reservation', {
      template: '<div ui-view></div>',
    })
    .state('reservation.new', {
      url: '/customer/company/:id/reservation',
      template: require('./customer_reservation.view.html'),
      controller: 'CustomerReservationCtrl',
      controllerAs: 'customer_reserv'
    })
}
