export default function showMore() {
  return {
    restrict: 'A',
    transclude: true,
    template: '<div class="show-more"><div class="show-more-collapsed"><div ng-transclude></div></div><a class="show-more-link" ng-click="showMore($event)" ng-show="expandable && !expanded">Meer weergeven</a></div>',
    controller: ['$scope', '$element', '$timeout', ($scope, $element, $timeout) => {
      $scope.expandable = false;
      $scope.expanded = false;

      $timeout(() => {
        const container = $element.children()[0].firstElementChild;
        const height = container.firstElementChild.clientHeight;
        const maxHeight = parseFloat(window.getComputedStyle(container).maxHeight || 62);

        $scope.expandable = height > maxHeight;
      }, 33);

      $scope.showMore = ($event) => {
        $event.stopPropagation();
        $element.children()[0].firstElementChild.className = ''; // removeClass('show-more-collapsed')
        $scope.expanded = true;
      };
    }],
  };
}
