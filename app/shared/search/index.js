import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './search.route';
import controller from './search.controller';

export default angular.module('app.search', [uirouter])
  .config(routing)
  .controller('SearchCtrl', controller)
  .name;
