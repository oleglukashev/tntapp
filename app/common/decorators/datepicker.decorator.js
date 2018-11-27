config.$inject = ['$provide'];

export default function config($provide) {
  $provide.decorator('uibDatepickerDirective', ['$delegate', '$timeout', function($delegate, $timeout) {
    var directive = $delegate[0];
    var link = directive.link;

    directive.compile = function() {
      return function(scope, element, attrs, ctrls) {
        link.apply(this, arguments);

        var datepickerCtrl = ctrls[0];
        var ngModelCtrl = ctrls[1];

        if (ngModelCtrl) {
          scope.$on('refreshDatepickers', function refreshView() {
            // settimeout fix problem when dates dont refresh after broadcasting sometimes
            $timeout(function() {
              datepickerCtrl.refreshView();
            }, 100);
          });
        }
      }
    };
    return $delegate;
  }]);
}
