import angular              		from 'angular';
import showAuthed           		from './show-authed.directive';
import stringToNumber           from './string_to_number.directive';

export default angular.module('app.directives', [])
  .directive('showAuthed', showAuthed)
  .directive('stringToNumber', stringToNumber)
  .name;
