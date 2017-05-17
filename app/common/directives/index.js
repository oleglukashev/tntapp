import angular                  from 'angular';
import showAuthed               from './show-authed.directive';

export default angular.module('app.directives', [])
  .directive('showAuthed', showAuthed)
  .name;
