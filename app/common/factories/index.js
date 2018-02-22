import angular from 'angular';

import responseFactory from './response.factory';

export default angular.module('app.factories', [])
  .factory('responseFactory', responseFactory)
  .name;
