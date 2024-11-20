import angular from 'angular';

export default class DashboardChartsCtrl {
  constructor(Charts, $scope, $compile, $timeout, $state) {
    'ngInject';

    this.charts = {};

    this.$timeout = $timeout;
    this.$compile = $compile;
    this.$scope = $scope;
    this.$state = $state;

    $scope.$on('resizeGraph', () => {
      this.resizeGraph();
    });

    this.$onInit = () => {
      this.charts.graphs = Charts.get(this.reservations);
      this.charts.getPercent = Charts.getPercent;
      this.guests_with_repeats = this.reservations.guests_with_repeats;
      this.guests_with_allergies = this.reservations.guests_with_allergies;
      this.guest_satisfactions = this.reservations.guest_satisfactions;
    }
  }

  showReservations(productId) {
    const params = productId > 0 ? { productId } : {};
    this.$state.go('app.reservations', params);
  }

  resizeGraph() {
    this.$timeout(() => {
      this.$compile(angular.element('.deze-week').contents())(this.$scope);
    }, 100);
  }
}
