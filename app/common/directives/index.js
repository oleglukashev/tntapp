import angular from 'angular';
import showAuthed from './show-authed.directive';
import datepickerPattern from './datepicker-pattern';
import resize from './resize';

export default angular.module('app.directives', [])
  .directive('showAuthed', showAuthed)
  .directive('awDatepickerPattern', datepickerPattern)
  .directive('resize', ['$window', '$rootScope', resize])
  .name;
