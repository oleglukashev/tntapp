export default class Notification {
  constructor() {
    'ngInject';

    this.text = '';
  }

  setText(text) {
    this.text = text;
  }

  getText() {
    return this.text;
  }
}
