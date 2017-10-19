export default class ChartsCtrl {
  constructor(Charts, $scope, $compile, $timeout, $state) {
    'ngInject';

    this.charts = {};

    this.$timeout = $timeout;
    this.$compile = $compile;
    this.$scope = $scope;
    this.$state = $state;

    $scope.$on('reservationsLoaded', (event, allReservations) => {
      this.charts.graphs = Charts.get(allReservations);
      this.charts.getPercent = Charts.getPercent;
    });

    $scope.$on('resizeGraph', () => {
      this.resizeGraph();
    });
  }

  showReservations(productId) {
    this.$state.go('app.reservations', {
      productId,
    });
  }

  resizeGraph() {
    this.$timeout(() => {
      this.$compile(angular.element('.deze-week').contents())(this.$scope);
    }, 100);
  }
}
