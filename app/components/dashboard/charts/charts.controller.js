export default class ChartsCtrl {
  constructor(Charts, $scope, $compile, $timeout) {
    'ngInject';

    this.charts   = {};

    this.$timeout = $timeout;
    this.$compile = $compile;
    this.$scope   = $scope;

    $scope.$on('reservationsLoaded', (event, all_reservations) => {
      this.charts.graphs = Charts.get(all_reservations);
    });

    $scope.$on('resizeGraph', () => {
      this.resizeGraph();
    });

  }

  resizeGraph() {
    this.$timeout(() => {
      this.$compile(angular.element('.deze-week').contents())(this.$scope);
    }, 100)
  }

}
