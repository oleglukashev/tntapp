function datepickerPattern() {
  'ngInject';

  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elem, attrs, ngModel) {
      var dRegex = new RegExp(attrs.awDatepickerPattern);

      ngModel.$parsers.unshift(function(value) {
        if (!value) {
          ngModel.$setValidity('date',true);
          return value;
        }

        if (typeof value === 'string') {
          var isValid = dRegex.test(value);
          ngModel.$setValidity('date',isValid);
          if (!isValid) {
            return undefined;
          }
        }

        return value;
      });

    }
  }
}

export default datepickerPattern;