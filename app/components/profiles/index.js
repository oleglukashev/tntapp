import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './profiles.route';
import controller from './profiles.controller';
import scrollMore from '../../common/directives/scroll-more';
import pageFilterFactory from '../../shared/page_filter/page_filter.factory';

export default angular.module('app.profiles', [uirouter])
  .config(routing)
  .controller('ProfilesCtrl', controller)
  .factory('PageFilterFactory', pageFilterFactory,
    ['Reservation', 'Customer', '$modal', 'moment'])
  .directive('scrollMore', scrollMore)
  .name;
