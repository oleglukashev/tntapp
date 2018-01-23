import angular from 'angular';

export default class ChartsCtrl {
  constructor(Charts, $scope, $compile, $timeout, $state, Loaded) {
    'ngInject';

    this.charts = {};

    this.$timeout = $timeout;
    this.$compile = $compile;
    this.$scope = $scope;
    this.$state = $state;

    this.guests_with_repeats = [];
    this.guests_with_allergies = [];

    $scope.$on('reservationsLoaded', () => {
      this.charts.graphs = Charts.get(Loaded.reservations);
      this.charts.getPercent = Charts.getPercent;
      this.guests_with_repeats = Loaded.reservations.guests_with_repeats;
      this.guests_with_allergies = Loaded.reservations.guests_with_allergies;
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
