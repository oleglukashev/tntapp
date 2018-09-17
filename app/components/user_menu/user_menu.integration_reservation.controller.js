export default class Controller {
  constructor(User, Tni, inReserv, $rootScope, $mdDialog) {
    'ngInject';

    this.currentCompanyId = User.getCompanyId();
    this.inReserv = inReserv;
    this.Tni = Tni;
    this.$mdDialog = $mdDialog;
    this.$rootScope = $rootScope;
  }

  close() {
    this.$mdDialog.cancel();
  }

  pay() {
    this.$rootScope.show_spinner = true;
    this.Tni.sendInvoice(this.currentCompanyId, this.inReserv.id).then((bill) => {
      this.$rootScope.show_spinner = false;
      this.inReserv.bill = bill;
    });
  }
}
