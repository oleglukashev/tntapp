import angular from 'angular';

import view from './footer.view.html';

export default angular.module('AppFooter', [])
  .component('footer', {
    template: view,
  })
  .name;
