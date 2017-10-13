export default class ChartsCtrl {
  constructor(Charts, $scope, $compile, $timeout) {
    'ngInject';

    this.charts = {};

    this.$timeout = $timeout;
    this.$compile = $compile;
    this.$scope = $scope;

    $scope.$on('reservationsLoaded', (event, allReservations) => {
      this.charts.graphs = Charts.get(allReservations);
      this.charts.getPercent = Charts.getPercent;
    });

    $scope.$on('resizeGraph', () => {
      this.resizeGraph();
    });
  }

  resizeGraph() {
    this.$timeout(() => {
      this.$compile(angular.element('.deze-week').contents())(this.$scope);
    }, 100);
  }
}
