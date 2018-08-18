export default class Controller {
  constructor($mdDialog, inReserv) {
    'ngInject';

    this.inReserv = inReserv;
    this.$mdDialog = $mdDialog;
  }

  close() {
    this.$mdDialog.cancel();
  }
}
