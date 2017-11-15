export default function showMore() {
  return {
    restrict: 'A',
    transclude: true,
    scope: {
      // FIXME: Trigger all calculations
      // Useful when (initial) view type switched from `calendar` to `list`
      // (dimensions of invisible elements are always zero)
      trigger: '@showMoreTrigger',
      lines: '@showMoreLines',
    },
    template: '<div class="show-more"><div class="show-more-collapsed"><div ng-transclude></div></div><a class="show-more-link" ng-click="showMore($event)" ng-show="expandable && !expanded">Meer weergeven</a></div>',
    controller: ['$scope', '$element', '$timeout', ($scope, $element, $timeout) => {
      $scope.expandable = false;
      $scope.expanded = false;

      $scope.$watch('trigger', () => {
        if ($scope.expanded) {
          return;
        }

        $timeout(() => {
          const container = $element.children()[0].firstElementChild;
          const style = window.getComputedStyle(container);
          const height = container.firstElementChild.clientHeight;
          const fontSize = parseFloat(style.fontSize);
          const lineHeight = parseFloat(style.lineHeight);
          const maxHeight = fontSize * (lineHeight / fontSize) * parseInt($scope.lines || 3, 10);

          container.style.maxHeight = `${maxHeight}px`;

          $scope.expandable = height > maxHeight;
        }, 33);
      });

      $scope.showMore = ($event) => {
        $event.stopPropagation();

        const container = $element.children()[0].firstElementChild;

        container.className = ''; // removeClass('show-more-collapsed')
        container.style.maxHeight = null;

        $scope.expanded = true;
      };
    }],
  };
}
