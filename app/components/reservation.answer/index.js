import angular from 'angular';
import controller from './reservation.answer.controller';
import view from './reservation.answer.view.html';

import EmailTextService from '../../common/services/email_text.service';

export default angular.module('reservationAnswer', [])
  .component('reservationAnswerComponent', {
    controller,
    controllerAs: 'ctrl',
    template: view,
    bindings: {
      resolve: '=',
      dismiss: '&',
    },
  })
  .service('EmailText', EmailTextService)
  .name;
