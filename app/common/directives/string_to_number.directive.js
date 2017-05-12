function stringToNumber() {
  'ngInject';

  return {
    require: 'ngModel',
    restrict: 'A',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(value) {
        return '' + value;
      });
      ngModel.$formatters.push(function(value) {
        return parseFloat(value);
      });
    }
  };
}

export default stringToNumber;
