import angular from 'angular';
import controller from './edit.user_menu.notes.controller';
import view from './edit.user_menu.notes.view.html';
import CustomerNoteService from '../../../../common/services/customer_note.service';
import UserMenuService from '../../user_menu.service';

export default angular.module('userMenuNotes', [])
  .component('userMenuNotes', {
    controller,
    controllerAs: 'ctrl',
    template: view,
    bindings: {
      dismiss: '=',
      customerNotes: '=',
      customer: '=',
    }
  })
  .service('CustomerNote', CustomerNoteService)
  .service('UserMenu', UserMenuService)
  .name;