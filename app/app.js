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
import dashboard                          from './components/dashboard/dashboard'


//require('ng-cache-loader!./shared/header/headerView.html');

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
    dashboard
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

      $stateProvider
        .state('app', {
          abstract: true,
          url: '/app',
          template: require('./components/layout/app.html')
        });
    }
  ])
  .controller('AppCtrl', ['$scope', '$translate', '$window',
    function(              $scope,   $translate,   $window ) {
      // add 'ie' classes to html
      const isIE = !!navigator.userAgent.match(/MSIE/i);
      if(isIE){ angular.element($window.document.body).addClass('ie');}
      if(isSmartDevice( $window ) ){ angular.element($window.document.body).addClass('smart')};

      // angular translate
      $scope.lang = { isopen: false };
      $scope.langs = { en:'English', de_DE:'German', it_IT:'Italian' };
      $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
      $scope.setLang = function(langKey, $event) {
        // set the current lang
        $scope.selectLang = $scope.langs[langKey];
        // You can change the language during runtime
        $translate.use(langKey);
        $scope.lang.isopen = !$scope.lang.isopen;
      };

      function isSmartDevice( $window )
      {
        // Adapted from http://www.detectmobilebrowsers.com
        const ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
        // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
        return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
      }

  }])
  .constant('JQ_CONFIG', {
    easyPieChart: ['../libs/jquery/jquery.easy-pie-chart/dist/jquery.easypiechart.fill.js'],
    sparkline: ['../libs/jquery/jquery.sparkline/dist/jquery.sparkline.retina.js'],
    plot: ['../libs/jquery/flot/jquery.flot.js', '../libs/jquery/flot/jquery.flot.pie.js', '../libs/jquery/flot/jquery.flot.resize.js', '../libs/jquery/flot.tooltip/js/jquery.flot.tooltip.min.js', '../libs/jquery/flot.orderbars/js/jquery.flot.orderBars.js', '../libs/jquery/flot-spline/js/jquery.flot.spline.min.js'],
    moment: ['../libs/jquery/moment/moment.js'],
    screenfull: ['../libs/jquery/screenfull/dist/screenfull.min.js'],
    slimScroll: ['../libs/jquery/slimscroll/jquery.slimscroll.min.js'],
    sortable: ['../libs/jquery/html5sortable/jquery.sortable.js'],
    nestable: ['../libs/jquery/nestable/jquery.nestable.js', '../libs/jquery/nestable/jquery.nestable.css'],
    filestyle: ['../libs/jquery/bootstrap-filestyle/src/bootstrap-filestyle.js'],
    slider: ['../libs/jquery/bootstrap-slider/bootstrap-slider.js', '../libs/jquery/bootstrap-slider/bootstrap-slider.css'],
    chosen: ['../libs/jquery/chosen/chosen.jquery.min.js', '../libs/jquery/chosen/bootstrap-chosen.css'],
    TouchSpin: ['../libs/jquery/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.js', '../libs/jquery/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.css'],
    wysiwyg: ['../libs/jquery/bootstrap-wysiwyg/bootstrap-wysiwyg.js', '../libs/jquery/bootstrap-wysiwyg/external/jquery.hotkeys.js'],
    dataTable: ['../libs/jquery/datatables/media/js/jquery.dataTables.min.js', '../libs/jquery/plugins/integration/bootstrap/3/dataTables.bootstrap.js', '../libs/jquery/plugins/integration/bootstrap/3/dataTables.bootstrap.css'],
    vectorMap: ['../libs/jquery/bower-jvectormap/jquery-jvectormap-1.2.2.min.js', '../libs/jquery/bower-jvectormap/jquery-jvectormap-world-mill-en.js', '../libs/jquery/bower-jvectormap/jquery-jvectormap-us-aea-en.js', '../libs/jquery/bower-jvectormap/jquery-jvectormap.css'],
    footable: ['../libs/jquery/footable/v3/js/footable.min.js', '../libs/jquery/footable/v3/css/footable.bootstrap.min.css'],
    fullcalendar: ['../libs/jquery/moment/moment.js', '../libs/jquery/fullcalendar/dist/fullcalendar.min.js', '../libs/jquery/fullcalendar/dist/fullcalendar.css', '../libs/jquery/fullcalendar/dist/fullcalendar.theme.css'],
    daterangepicker: ['../libs/jquery/moment/moment.js', '../libs/jquery/bootstrap-daterangepicker/daterangepicker.js', '../libs/jquery/bootstrap-daterangepicker/daterangepicker-bs3.css'],
    tagsinput: ['../libs/jquery/bootstrap-tagsinput/dist/bootstrap-tagsinput.js', '../libs/jquery/bootstrap-tagsinput/dist/bootstrap-tagsinput.css']

  }).constant('MODULE_CONFIG', [{
    name: 'ngGrid',
    files: ['../libs/angular/ng-grid/build/ng-grid.min.js', '../libs/angular/ng-grid/ng-grid.min.css', '../libs/angular/ng-grid/ng-grid.bootstrap.css']
  }, {
    name: 'ui.grid',
    files: ['../libs/angular/angular-ui-grid/ui-grid.min.js', '../libs/angular/angular-ui-grid/ui-grid.min.css', '../libs/angular/angular-ui-grid/ui-grid.bootstrap.css']
  }, {
    name: 'ui.select',
    files: ['../libs/angular/angular-ui-select/dist/select.min.js', '../libs/angular/angular-ui-select/dist/select.min.css']
  }, {
    name: 'angularFileUpload',
    files: ['../libs/angular/angular-file-upload/angular-file-upload.js']
  }, {
    name: 'ui.calendar',
    files: ['../libs/angular/angular-ui-calendar/src/calendar.js']
  }, {
    name: 'ngImgCrop',
    files: ['../libs/angular/ngImgCrop/compile/minified/ng-img-crop.js', '../libs/angular/ngImgCrop/compile/minified/ng-img-crop.css']
  }, {
    name: 'angularBootstrapNavTree',
    files: ['../libs/angular/angular-bootstrap-nav-tree/dist/abn_tree_directive.js', '../libs/angular/angular-bootstrap-nav-tree/dist/abn_tree.css']
  }, {
    name: 'toaster',
    files: ['../libs/angular/angularjs-toaster/toaster.js', '../libs/angular/angularjs-toaster/toaster.css']
  }, {
    name: 'textAngular',
    files: ['../libs/angular/textAngular/dist/textAngular-sanitize.min.js', '../libs/angular/textAngular/dist/textAngular.min.js']
  }, {
    name: 'vr.directives.slider',
    files: ['../libs/angular/venturocket-angular-slider/build/angular-slider.min.js', '../libs/angular/venturocket-angular-slider/build/angular-slider.css']
  }, {
    name: 'com.2fdevs.videogular',
    files: ['../libs/angular/videogular/videogular.min.js']
  }, {
    name: 'com.2fdevs.videogular.plugins.controls',
    files: ['../libs/angular/videogular-controls/controls.min.js']
  }, {
    name: 'com.2fdevs.videogular.plugins.buffering',
    files: ['../libs/angular/videogular-buffering/buffering.min.js']
  }, {
    name: 'com.2fdevs.videogular.plugins.overlayplay',
    files: ['../libs/angular/videogular-overlay-play/overlay-play.min.js']
  }, {
    name: 'com.2fdevs.videogular.plugins.poster',
    files: ['../libs/angular/videogular-poster/poster.min.js']
  }, {
    name: 'com.2fdevs.videogular.plugins.imaads',
    files: ['../libs/angular/videogular-ima-ads/ima-ads.min.js']
  }, {
    name: 'xeditable',
    files: ['../libs/angular/angular-xeditable/dist/js/xeditable.min.js', '../libs/angular/angular-xeditable/dist/css/xeditable.css']
  }, {
    name: 'smart-table',
    files: ['../libs/angular/angular-smart-table/dist/smart-table.min.js']
  }, {
    name: 'angular-skycons',
    files: ['../libs/angular/angular-skycons/angular-skycons.js']
  }]).config(['$ocLazyLoadProvider', 'MODULE_CONFIG', function ($ocLazyLoadProvider, MODULE_CONFIG) {
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
