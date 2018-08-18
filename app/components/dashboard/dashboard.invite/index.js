import angular from 'angular';
import controller from './dashboard.invite.controller';
import view from './dashboard.invite.view.html';

import InviteService from '../../../common/services/invite.service';

export default angular.module('dashboardInvite', [])
  .component('dashboardInviteComponent', {
    controller,
    controllerAs: 'ctrl',
    template: view,
    bindings: {
      resolve: '=',
      dismiss: '&',
    },
  })
  .service('Invite', InviteService)
  .name;



