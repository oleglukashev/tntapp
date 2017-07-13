function resize($window, $rootScope) {
  'ngInject';

  return {
    restrict: 'A',
    link: function ($scope, element, attrs){
      angular.element($window).bind('resize', function(){
        $rootScope.$broadcast('resizeGraph');
        $scope.windowWidth = $window.innerWidth;
      });
    }
  };
}

export default resize;