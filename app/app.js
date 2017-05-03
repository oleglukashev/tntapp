import styles                             from './assets/css/app.styl'
import angular                            from 'angular'
import angular_animate                    from 'angular-animate'
import angular_ng_uploader                from 'ng-file-upload'
import angular_material                   from 'angular-material'
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
import dnd_lists                          from './common/directives/angular-drag-and-drop-lists.directive'
import main_route                         from './config.router'
import init_templates                     from './config.templates'
import app_controller                     from './common/controllers/app.controller'
import header_controller                  from './shared/header/header.controller'
import user_menu_controller               from './shared/user_menu/user_menu.controller'
import profile_controller                 from './components/dashboard/profile/profile.controller'
import search                             from './shared/search'
import dashboard                          from './components/dashboard'
import new_reservation                    from './components/reservation'
import settings                           from './components/settings'
import charts_controller                  from './components/dashboard/charts/charts.controller'
import auth                               from './components/auth'
import                                         './common/services'
import                                         './common/directives'
import chartjs from                   'angular-chart.js'

const app = angular
  .module('app', [
    angular_animate,
    angular_ng_uploader,
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
    angular_material,
    ui_load,
    anguar_oclazyLoad,
    ui_jq,
    dnd_lists,
    search,
    dashboard,
    new_reservation,
    auth,
    settings,
    'app.services',
    'app.directives',
    chartjs
  ])

  .config(['ChartJsProvider', function (ChartJsProvider) {
    ChartJsProvider.setOptions({
      chartColors: ['#787878', '#c8c8c8'],
      responsive : true
    });
  }])


  .config(main_route)
  .constant('AppConstants', {
    jwtKey: 'jwtToken',
    appName: 'TNT',
  })
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
  .controller('HeaderCtrl', header_controller)
  .controller('UserMenuCtrl', user_menu_controller)
  .controller('ProfileCtrl', profile_controller)
  .controller('ChartsCtrl', charts_controller)
  .constant('JQ_CONFIG', {
    easyPieChart: ['vendor/jquery/jquery.easy-pie-chart/dist/jquery.easypiechart.fill.js'],
    plot: ['vendor/jquery/flot/jquery.flot.js'],
  }).constant('MODULE_CONFIG', [])
  .config(['$ocLazyLoadProvider', 'MODULE_CONFIG', function ($ocLazyLoadProvider, MODULE_CONFIG) {
    // We configure ocLazyLoad to use the lib script.js as the async loader
    $ocLazyLoadProvider.config({
      debug: false,
      events: true,
      modules: MODULE_CONFIG
    });
  }])
  .config(['$mdThemingProvider', function($mdThemingProvider) {
    $mdThemingProvider.disableTheming();
  }])
  .run(init_templates);
