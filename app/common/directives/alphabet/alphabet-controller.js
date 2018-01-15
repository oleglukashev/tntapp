import { splitArray } from '../../utils';

export default class AlphabetController {
  constructor($scope) {
    this.$scope = $scope;
    this.$scope.letters = this.letters();
  }

  groupBy() {
    return parseInt(this.$scope.groupBy || 1, 10);
  }

  letters() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const groups = splitArray(alphabet, this.groupBy());

    return [['&']].concat(groups).concat([['#']]);
  }
}
