import styles             from './assets/css/app.styl'
import angular            from 'angular'
import angular_animate    from 'angular-animate'
import angular_aria       from 'angular-aria'
import angular_cookies    from 'angular-cookies'
import angular_messages   from 'angular-messages'
import angular_resource   from 'angular-resource'
import angular_sanitize   from 'angular-sanitize'
import angular_touch      from 'angular-touch'
import angular_storage    from 'angular-storage'
import angular_ui_router  from 'angular-ui-router'
import angular_ui_bootstrap  from 'angular-bootstrap-npm'
import angular_translate  from 'angular-translate'
import angular_translate_storage_locale from 'angular-translate-storage-local'
import angular_translate_storage_cookie from 'angular-translate-storage-cookie'
import layout from './components/layout/app.html'


const app = angular
  .module('app', [
    angular_animate,
    angular_aria,
    angular_cookies,
    angular_messages,
    angular_resource,
    angular_sanitize,
    angular_touch,
    angular_storage,
    angular_ui_router,
    angular_ui_bootstrap,
    angular_translate,
    angular_translate_storage_locale,
    angular_translate_storage_cookie
  ])
  .config(['$translateProvider', function($translateProvider){
    // Register a loader for the static files
    // So, the module will search missing translation tables under the specified urls.
    // Those urls are [prefix][langKey][suffix].
    // $translateProvider.useStaticFilesLoader({
    //   prefix: 'l10n/',
    //   suffix: '.js'
    // });
    // Tell the module what language to use by default
    $translateProvider.preferredLanguage('en');
    // Tell the module to store the language in the local storage
    $translateProvider.useLocalStorage();
  }])
  .config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
    function ($controllerProvider,   $compileProvider,   $filterProvider,   $provide) {
      // lazy controller, directive and service
      // app.controller = $controllerProvider.register;
      // app.directive  = $compileProvider.directive;
      // app.filter     = $filterProvider.register;
      // app.factory    = $provide.factory;
      // app.service    = $provide.service;
      // app.constant   = $provide.constant;
      // app.value      = $provide.value;
    }
  ])
  .run(['$rootScope', '$state', '$stateParams',
    function ($rootScope,   $state,   $stateParams) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
    }
  ])
  .config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider,   $urlRouterProvider) {
      $urlRouterProvider.otherwise('/app/dashboard');

      alert(1);

      $stateProvider
        .state('app', {
          abstract: true,
          url: '/app',
          template: layout
        });
    }
  ]
);
