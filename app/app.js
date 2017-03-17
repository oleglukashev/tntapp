import styles                             from './assets/css/app.styl'
import angular                            from 'angular'
import angular_animate                    from 'angular-animate'
import angular_aria                       from 'angular-aria'
import angular_cookies                    from 'angular-cookies'
import angular_messages                   from 'angular-messages'
import angular_resource                   from 'angular-resource'
import angular_sanitize                   from 'angular-sanitize'
import angular_touch                      from 'angular-touch'
import angular_ui_router                  from 'angular-ui-router'
import angular_ui_bootstrap               from 'angular-bootstrap-npm'
import angular_translate                  from 'angular-translate'
import angular_translate_storage_locale   from 'angular-translate-storage-local'
import angular_translate_storage_cookie   from 'angular-translate-storage-cookie'
import angular_moment                     from 'angular-moment'
import anguar_oclazyLoad                  from 'oclazyload'
import ui_load                            from './common/services/ui-load'
import ui_jq                              from './common/directives/ui-jq'
import main_route                         from './config.router'
import app_controller                     from './common/controllers/app.controller'
import dashboard                          from './components/dashboard'
import                                         './common/services'


const app = angular
  .module('app', [
    angular_animate,
    angular_aria,
    angular_cookies,
    angular_messages,
    angular_resource,
    angular_sanitize,
    angular_touch,
    angular_ui_router,
    angular_ui_bootstrap,
    angular_translate,
    angular_translate_storage_locale,
    angular_translate_storage_cookie,
    angular_moment,
    ui_load,
    anguar_oclazyLoad,
    ui_jq,
    dashboard,
    'app.services'
  ])
  .config(main_route)
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
      //lazy controller, directive and service
      app.controller = $controllerProvider.register;
      app.directive  = $compileProvider.directive;
      app.filter     = $filterProvider.register;
      app.factory    = $provide.factory;
      app.service    = $provide.service;
      app.constant   = $provide.constant;
      app.value      = $provide.value;
    }
  ])
  .run(['$rootScope', '$state', '$stateParams',
    function ($rootScope,   $state,   $stateParams) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
    }
  ])
  .controller('AppCtrl', app_controller)
  .constant('JQ_CONFIG', {
    easyPieChart: ['vendor/jquery/jquery.easy-pie-chart/dist/jquery.easypiechart.fill.js'],
  }).constant('MODULE_CONFIG', [])
  .config(['$ocLazyLoadProvider', 'MODULE_CONFIG', function ($ocLazyLoadProvider, MODULE_CONFIG) {
    // We configure ocLazyLoad to use the lib script.js as the async loader
    $ocLazyLoadProvider.config({
      debug: false,
      events: true,
      modules: MODULE_CONFIG
    });
  }])
  .run(["$templateCache", function ($templateCache) {
    //remove later
    $templateCache.removeAll();
    $templateCache.put("headerView.html", require("./shared/header/headerView.html"));
  }]);
