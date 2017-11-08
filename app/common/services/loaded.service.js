import angular from 'angular';

export default class Loaded {
  constructor($rootScope) {
    'ngInject';

    this.$rootScope = $rootScope;

    this.reservations = {
      action_required: [],
      group_this_week: [],
      today: [],
      count_per_year: 0,
      count_per_month: 0,
      count_per_week: 0,
      count_by_week: 0,
    };
  }
}
