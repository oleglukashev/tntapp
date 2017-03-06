import styles             from './assets/css/app.styl'
import angular            from 'angular'
import angular_animate    from 'angular-animate'
import angular_aria       from 'angular-aria'
import angular_cookies    from 'angular-cookies'
import angular_messages   from 'angular-messages'
import angular_resource   from 'angular-resource'
import angular_sanitize   from 'angular-sanitize'
import angular_touch      from 'angular-touch'
import angular_ui_router  from 'angular-ui-router'
import angular_ui_bootstrap  from 'angular-bootstrap-npm'
import angular_translate  from 'angular-translate'
import angular_translate_storage_locale from 'angular-translate-storage-local'
import angular_translate_storage_cookie from 'angular-translate-storage-cookie'
import dashboard from './components/dashboard/dashboard'


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

      // config
      $scope.app = {
        name: 'Angulr',
        version: '2.2.0',
        // for chart colors
        color: {
          primary: '#7266ba',
          info:    '#23b7e5',
          success: '#27c24c',
          warning: '#fad733',
          danger:  '#f05050',
          light:   '#e8eff0',
          dark:    '#3a3f51',
          black:   '#1c2b36'
        },
        settings: {
          themeID: 1,
          asideColor: 'bg-black',
          headerFixed: true,
          asideFixed: false,
          asideFolded: false,
          asideDock: false,
          container: false
        }
      }

      // // save settings to local storage
      // if ( angular.isDefined($localStorage.settings) ) {
      //   $scope.app.settings = $localStorage.settings;
      // } else {
      //   $localStorage.settings = $scope.app.settings;
      // }
      $scope.$watch('app.settings', function(){
        if( $scope.app.settings.asideDock  &&  $scope.app.settings.asideFixed ){
          // aside dock and fixed must set the header fixed.
          $scope.app.settings.headerFixed = true;
        }
        // for box layout, add background image
        $scope.app.settings.container ? angular.element('html').addClass('bg') : angular.element('html').removeClass('bg');
        // save to local storage
        // $localStorage.settings = $scope.app.settings;
      }, true);

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
    .run(["$templateCache", function ($templateCache) {
      $templateCache.put("headerView.html", require("./shared/header/headerView.html"));
    }]);
