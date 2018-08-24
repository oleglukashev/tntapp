import angular from 'angular';
import angularNgUploader from 'ng-file-upload';

import headerController from './header.controller';
import headerView from './header.view.html';

import headerSearchController from './header.search/header.search.controller';
import headerSearchView from './header.search/header.search.view.html';

import headerUserMenuController from './header.user_menu/header.user_menu.controller';
import headerUserMenuView from './header.user_menu/header.user_menu.view.html';

import SearchService from '../../common/services/search.service';
import UserService from '../../common/services/user.service';
import NotificationService from '../../common/services/notification.service';
import JWTService from '../../common/services/jwt.service';
import SettingsService from '../../common/services/settings.service';


export default angular.module('AppHeader', [angularNgUploader])
  .component('appHeader', {
    controller: headerController,
    controllerAs: 'ctrl',
    template: headerView,
  })
  .component('headerSearch', {
    controller: headerSearchController,
    controllerAs: 'ctrl',
    template: headerSearchView
  })
  .component('headerUserMenu', {
    controller: headerUserMenuController,
    controllerAs: 'ctrl',
    template: headerUserMenuView
  })
  .service('Notification', NotificationService)
  .service('Search', SearchService)
  .name;
