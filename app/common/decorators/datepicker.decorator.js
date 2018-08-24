config.$inject = ['$provide'];

export default function config($provide) {
  $provide.decorator('uibDatepickerDirective', ['$delegate', function($delegate) {
    var directive = $delegate[0];
    var link = directive.link;

    directive.compile = function() {
      return function(scope, element, attrs, ctrls) {
        link.apply(this, arguments);

        var datepickerCtrl = ctrls[0];
        var ngModelCtrl = ctrls[1];

        if (ngModelCtrl) {
          // Listen for 'refreshDatepickers' event...
          scope.$on('refreshDatepickers', function refreshView() {
            datepickerCtrl.refreshView();
          });
        }
      }
    };
    return $delegate;
  }]);
}
