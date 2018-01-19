import angular from 'angular';
import angularJwt from 'angular-jwt';
import angularAnimate from 'angular-animate';
import angularNgUploader from 'ng-file-upload';
import angularMaterial from 'angular-material';
import angularAria from 'angular-aria';
import angularCookies from 'angular-cookies';
import angularMessages from 'angular-messages';
import angularResource from 'angular-resource';
import angularSanitize from 'angular-sanitize';
import angularTouch from 'angular-touch';
import angularUiRouter from 'angular-ui-router';
import angularUiBootstrap from 'angular-bootstrap-npm';
import angularTranslate from 'angular-translate';
import angularTranslateStorageLocale from 'angular-translate-storage-local';
import angularTranslateStorageCookie from 'angular-translate-storage-cookie';
import angularMoment from 'angular-moment';
import anguarOclazyLoad from 'oclazyload';
import rzModule from 'angularjs-slider';
import satellizer from 'satellizer';
import chartjs from 'angular-chart.js';
import 'angular-growl-notifications';

import dnd from './shared/dnd';
import uiLoad from './common/services/ui-load';
import uiJq from './common/directives/ui-jq';
import dndLists from './common/directives/angular-drag-and-drop-lists.directive';
import mainRoute from './config.router';
import jwtConfig from './config.jwt';
import initTemplates from './config.templates';
import editReservationController from './components/edit_reservation/edit_reservation.controller';
import search from './components/search';
import dashboard from './components/dashboard';
import dashboardReservations from './components/dashboard/reservations/dashboard_reservations.controller';
import reservations from './components/reservations';
import customerReservation from './components/customer_reservation';
import appController from './common/controllers/app.controller';
import headerController from './shared/header/header.controller';
import userMenuController from './shared/user_menu/user_menu.controller';
import mobileMenuController from './shared/mobile_menu/mobile_menu.controller';
import newReservationController from './components/new_reservation/new_reservation.controller';
import reservationAnswerController from './components/reservation_answer/reservation_answer.controller';
import chartsController from './components/dashboard/charts/charts.controller';
import pageFilterTimeRangesController from './shared/page_filter/time_ranges/page_filter_time_ranges.controller';
import searchHeaderController from './components/search/search.header.controller';
import agenda from './components/agenda';
import settings from './components/settings';
import auth from './components/auth';
import profiles from './components/profiles';
import constants from './config.constants';
import editUser from './shared/user_menu/edit';
import './assets/css/app.styl';
import './common/services';
import './common/directives';
import './common/filters/time_reservation_id_sort.filter';

angular
  .module('app', [angularJwt, angularAnimate, angularNgUploader, angularAria, angularCookies,
    angularMessages, angularResource, angularSanitize, angularTouch, angularUiRouter,
    angularUiBootstrap, angularTranslate, angularTranslateStorageLocale,
    angularTranslateStorageCookie, angularMoment, angularMaterial, uiLoad, anguarOclazyLoad, uiJq,
    dndLists, satellizer, search, dashboard, customerReservation,
    reservations, dnd, agenda, auth, settings, rzModule, chartjs, profiles, constants, editUser,
    'app.services', 'app.directives', 'app.filters', 'growlNotifications',
  ])
  .config(jwtConfig)
  .controller('AppCtrl', appController)
  .controller('HeaderCtrl', headerController)
  .controller('UserMenuCtrl', userMenuController)
  .controller('MobileMenuCtrl', mobileMenuController)
  .controller('ChartsCtrl', chartsController)
  .controller('NewReservationCtrl', newReservationController)
  .controller('EditReservationCtrl', editReservationController)
  .controller('DashboardReservationsCtrl', dashboardReservations)
  .controller('PageFilterTimeRangesCtrl', pageFilterTimeRangesController)
  .controller('ReservationAnswerCtrl', reservationAnswerController)
  .controller('SearchHeaderCtrl', searchHeaderController)
  .config(['$ocLazyLoadProvider', 'MODULE_CONFIG', ($ocLazyLoadProvider, MODULE_CONFIG) => {
    // We configure ocLazyLoad to use the lib script.js as the async loader
    $ocLazyLoadProvider.config({
      debug: false,
      events: true,
      modules: MODULE_CONFIG,
    });
  }])
  .config(['$mdThemingProvider', ($mdThemingProvider) => {
    $mdThemingProvider.disableTheming();
  }])
  .config(['ChartJsProvider', (ChartJsProvider) => {
    ChartJsProvider.setOptions({
      chartColors: ['#787878', '#c8c8c8'],
      responsive: true,
    });
  }])
  .config(mainRoute)
  .config(['$authProvider', ($authProvider) => {
    $authProvider.facebook({
      clientId: FACEBOOK_ID,
      url: API_URL + '/auth/facebook/',
    });
    $authProvider.twitter({
      url: API_URL + '/auth/twitter',
    });
  }])
  .config(['$mdDateLocaleProvider', ($mdDateLocaleProvider) => {
    $mdDateLocaleProvider.firstDayOfWeek = 1;
  }])
  .config(['$translateProvider', ($translateProvider) => {
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
  .run(initTemplates)
  .run(['$rootScope', '$state', '$stateParams',
    ($rootScope, $state, $stateParams) => {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
    },
  ]);
