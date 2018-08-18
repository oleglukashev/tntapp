import angular from 'angular';
import buttons from 'angular-ui-bootstrap/src/buttons';
import satellizer from 'satellizer';
import controller from './new.dashboard.reservation.controller';
import view from './new.dashboard.reservation.view.html';

import ConfirmService from '../../common/services/confirm.service';
import SettingsService from '../../common/services/settings.service';

import NewReservation from '../new_reservation';
import WalkinNewReservation from '../walkin.new_reservation';

export default angular.module('newDashboardReservation', [
  buttons,
  satellizer,
  NewReservation,
  WalkinNewReservation])
  .component('newDashboardReservation', {
    controller,
    controllerAs: 'ctrl',
    template: view,
    bindings: {
      resolve: '<',
      dismiss: '&',
    },
  })
  .service('Confirm', ConfirmService)
  .service('Settings', SettingsService)
  .config(['$authProvider', ($authProvider) => {
    $authProvider.facebook({
      clientId: FACEBOOK_ID,
      url: API_URL + '/auth/facebook/',
    });
    $authProvider.twitter({
      url: API_URL + '/auth/twitter',
    });
  }])
  .name;
