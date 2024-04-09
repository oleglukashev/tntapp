import angular from 'angular';
import buttons from 'angular-ui-bootstrap/src/buttons';
import satellizer from 'satellizer';
import socialLogin from '../../common/services/angularjs-social-login';
import controller from './new.leads.reservation.controller';
import view from './new.leads.reservation.view.html';

import ConfirmService from '../../common/services/confirm.service';
import SettingsService from '../../common/services/settings.service';

import NewReservation from '../new_reservation';
import WalkinNewReservation from '../walkin.new_reservation';

import phoneValidDirective from '../../common/directives/phone-valid.directive';

export default angular.module('newLeadsReservation', [
  buttons,
  satellizer,
  socialLogin,
  NewReservation,
  WalkinNewReservation])
  .component('newLeadsReservation', {
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
  .directive('phoneValid', phoneValidDirective)
  .config(['$authProvider', 'socialProvider', ($authProvider, socialProvider) => {
    socialProvider.setFbKey({appId: FACEBOOK_ID, apiVersion: 'v2.8'});
    $authProvider.twitter({
      url: API_URL + '/auth/twitter',
    });
  }])
  .name;
