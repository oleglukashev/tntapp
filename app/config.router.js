'use strict';

/**
 * Config for the router
 */

angular.module('app')
  .run(
    ['$rootScope', '$state', '$stateParams',
      function ($rootScope,   $state,   $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
      }
    ]
  )
  .config(
    ['$stateProvider', '$urlRouterProvider', 'JQ_CONFIG', 'MODULE_CONFIG',
      function ($stateProvider,   $urlRouterProvider, JQ_CONFIG, MODULE_CONFIG) {
        var layout = "app/components/layout/app.html";

        $urlRouterProvider.otherwise('/app/dashboard');

        $stateProvider
            .state('app', {
              abstract: true,
              url: '/app',
              templateUrl: layout
            })
            .state('app.dashboard', {
              url: '/dashboard',
              templateUrl: 'app/components/dashboard/dashboardView.html'
            });
      }
    ]
  );
