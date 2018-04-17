import angular from 'angular';
import routing from './analytics.route';
import controller from './analytics.controller';

export default angular.module('app.analytics', [])
  .config(routing)
  .controller('AnalyticsCtrl', controller)
  .name;
