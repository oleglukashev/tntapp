import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './profiles.route';
import controller from './profiles.controller';

export default angular.module('app.profiles', [uirouter])
  .config(routing)
  .controller('ProfilesCtrl', controller)
  .name;
