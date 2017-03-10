import angular from 'angular'
import ui_js_directive from './ui-jq'


export default angular.module('ui.jq', ['ui.load'])
  .value('uiJqConfig', {})
  .directive('uiJq', ui_js_directive)
  .name;