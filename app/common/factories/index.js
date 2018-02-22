import angular from 'angular';

import modalOptionsFactory from './modal-options.factory';
import responseFactory from './response.factory';

export default angular.module('app.factories', [])
  .factory('responseFactory', responseFactory)
  .service('modalOptionsFactory', modalOptionsFactory)
  .name;
