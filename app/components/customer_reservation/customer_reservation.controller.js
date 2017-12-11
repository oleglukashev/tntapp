import angular from 'angular';

export default class CustomerReservationCtrl {
  constructor($stateParams, $state) {
    'ngInject';

    if ($state.current.name === 'customer_reservation.alternative') {
      const params = {
        id: $stateParams.rid,
        date: $stateParams.date,
        aantal_personen: $stateParams.aantal_personen,
      }

      $state.go('customer_reservation.new', params);
    } else if ($state.current.name === 'customer_reservation.alternative_start') {
      const params = {
        id: $stateParams.id,
        date: $stateParams.date,
        aantal_personen: $stateParams.aantal_personen,
      }

      $state.go('customer_reservation.new', params);
    }
  }
}
