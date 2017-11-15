import angular from 'angular';
import showAuthed from './show-authed.directive';
import datepickerPattern from './datepicker-pattern';
import datepickerRefresh from './datepicker-refresh';
import resize from './resize';
import showMore from '../../common/directives/show-more';

export default angular.module('app.directives', [])
  .directive('showAuthed', showAuthed)
  .directive('datepickerRefresh', datepickerRefresh)
  .directive('awDatepickerPattern', datepickerPattern)
  .directive('resize', ['$window', '$rootScope', resize])
  .directive('showMore', showMore)
  .name;
