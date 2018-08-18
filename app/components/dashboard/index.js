import angular from 'angular';
import angularMoment from 'angular-moment';
import angularNgUploader from 'ng-file-upload';
import modal from 'angular-ui-bootstrap/src/modal';
import angularAnimate from 'angular-animate';
import controller from './dashboard.controller';
import view from './dashboard.view.html';
import uiLoad from '../../common/services/ui-load';
import uiJq from '../../common/directives/ui-jq';

import fixDashboardReservationsView from './fix.dashboard.reservations/fix.dashboard.reservations.view.html';
import fixDashboardChartsView from './fix.dashboard.charts/fix.dashboard.charts.view.html';
import fixReservationsItemView from '../fix.reservations.item/fix.reservations.item.view.html';

import InviteService from '../../common/services/invite.service';

import reservationItem from '../reservation.item';
import dashboardCharts from './dashboard.charts';
import dashboardInvite from './dashboard.invite';
import dashboardReservations from './dashboard.reservations';

export default angular.module('dashboard', [
    angularMoment,
    angularNgUploader,
    angularAnimate,
    uiLoad,
    uiJq,
    reservationItem,
    dashboardReservations,
    dashboardCharts,
    dashboardInvite,
    modal,
  ])
  .component('dashboardComponent', {
    controller,
    controllerAs: 'dash',
    template: view,
  })
  .component('fixDashboardReservations', {
    template: fixDashboardReservationsView,
  })
  .component('fixDashboardCharts', {
    template: fixDashboardChartsView,
  })
  .component('fixReservationsItem', {
    template: fixReservationsItemView,
  })
  .service('Invite', InviteService)
  .name;
