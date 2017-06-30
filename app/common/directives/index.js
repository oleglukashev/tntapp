import angular                  from 'angular';
import showAuthed               from './show-authed.directive';
import datepickerPattern        from './datepicker-pattern';

export default angular.module('app.directives', [])
  .directive('showAuthed', showAuthed)
  .directive('awDatepickerPattern', datepickerPattern)
  .name;
