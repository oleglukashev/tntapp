import angular from 'angular';
import controller from './pagination.controller';
import view from './pagination.view.html';

export default angular.module('pagination', [])
  .component('pagination', {
    controller,
    controllerAs: 'ctrl',
    template: view,
    bindings: {
      checkNextPage: '&',
      page: '<',
      perPage: '<',
      next: '&',
      prev: '&',
    }
  })
  .name;
