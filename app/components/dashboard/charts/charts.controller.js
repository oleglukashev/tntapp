export default class ChartsCtrl {
  constructor(Charts, $scope, $compile, $timeout, $state, Loaded) {
    'ngInject';

    this.charts = {};

    this.$timeout = $timeout;
    this.$compile = $compile;
    this.$scope = $scope;
    this.$state = $state;

    $scope.$on('reservationsLoaded', () => {
      this.charts.graphs = Charts.get(Loaded.reservations);
      this.charts.getPercent = Charts.getPercent;
    });

    $scope.$on('resizeGraph', () => {
      this.resizeGraph();
    });
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
