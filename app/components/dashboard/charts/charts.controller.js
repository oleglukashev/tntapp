export default class ChartsCtrl {
  constructor(Charts, $scope) {
    'ngInject';

    this.doughnut = {};

    $scope.$on('reservationsLoaded', function (event, data) {
      let all_reservations = $scope.$parent.dash.all_reservations;
      $scope.charts.graphs = Charts.get(all_reservations);
    });
  }

}
