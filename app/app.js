import angular from 'angular';
import angularJwt from 'angular-jwt';
import angularMaterial from 'angular-material';
import angularCookies from 'angular-cookies';
import angularSanitize from 'angular-sanitize';
import angularUiRouter from '@uirouter/angularjs';
import oclazyload from 'oclazyload';
import dropdown from 'angular-ui-bootstrap/src/dropdown';
import angularTranslate from 'angular-translate';
import angularTranslateStorageLocale from 'angular-translate-storage-local';
import angularTranslateStorageCookie from 'angular-translate-storage-cookie';
import 'angular-growl-notifications';

// Internet Explorer compatibility
import 'core-js/es6/symbol';
import 'core-js/es6/array';
import 'core-js/es7/array';
import 'core-js/es7/object';

import header from './components/header';
import mobileMenu from './components/mobile_menu';
import trial from './components/trial';
import userMenu from './components/user_menu';

import route from './config.router';
import jwtConfig from './config.jwt';
import translatesWithMdDateFormatConfig from './config.translatesWithMdDateFormat';
import initTemplates from './config.templates';
import appController from './common/controllers/app.controller';
import constants from './config.constants';
import './assets/css/app.styl';

import UserService from './common/services/user.service';
import JWTService from './common/services/jwt.service';
import SettingsService from './common/services/settings.service';
import responseFactory from './common/factories/response.factory';
import modalOptionsFactory from './common/factories/modal-options.factory';
import ThemeService from './common/services/theme.service';

angular
  .module('app', [angularJwt, angularMaterial, angularCookies, angularSanitize, angularUiRouter,
    dropdown, angularTranslate, constants, header, userMenu, oclazyload,
    mobileMenu, trial,
  ])
  .factory('responseFactory', responseFactory)
  .factory('modalOptionsFactory', modalOptionsFactory)
  .service('User', UserService)
  .service('Settings', SettingsService)
  .service('JWT', JWTService)
  .service('Theme', ThemeService)
  .controller('AppCtrl', appController)
  .config(['$mdThemingProvider', ($mdThemingProvider) => {
    $mdThemingProvider.disableTheming();
  }])
  .config(route)
  .config(jwtConfig)
  .config(['$httpProvider', ($httpProvider) => {
    $httpProvider.interceptors.push('responseFactory');
  }])
  .config(translatesWithMdDateFormatConfig)
  .run(initTemplates)
  .run(['$rootScope', '$state', '$stateParams',
    ($rootScope, $state, $stateParams) => {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
    },
  ]);

