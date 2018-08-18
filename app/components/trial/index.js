import angular from 'angular';
import angularMoment from 'angular-moment';
import controller from './trial.controller';
import view from './trial.view.html';

import UserService from '../../common/services/user.service';
import PaymentModal from '../../common/services/payment-modal';

export default angular.module('Trial', [angularMoment])
  .component('trial', {
    controller,
    controllerAs: 'ctrl',
    template: view,
  })
  .service('User', UserService)
  .service('PaymentModal', PaymentModal)
  .name;
