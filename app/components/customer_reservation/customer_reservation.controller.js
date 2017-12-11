import angular from 'angular';
import { getParameterByName } from '../../common/utils';

export default class CustomerReservationCtrl {
  constructor($stateParams, $state) {
    'ngInject';

    if ($state.current.name === 'customer_reservation.new_alternative') {
      const companyIdFromUrl = getParameterByName('rid');
      $state.go('customer_reservation.new', { id: companyIdFromUrl });
    }
  }
}
