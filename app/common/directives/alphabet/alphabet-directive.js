import Controller from './alphabet-controller';
import './alphabet.style.styl';
import Template from './alphabet-template.html';

export default class Alphabet {
  constructor() {
    this.restricted = 'E';
    this.template = Template;
    this.scope = {
      groupBy: '@',
      letterClicked: '&',
    };

    this.controller = ['$scope', $scope => new Controller($scope)];
  }
}
