import b64toBlob from 'b64-to-blob';

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

  sendInvoice() {
    this.$rootScope.show_spinner = true;
    this.Tni.sendInvoice(this.currentCompanyId, this.inReserv.id).then((bill) => {
      this.$rootScope.show_spinner = false;
      this.inReserv.bill = bill;
    }, (error) => {
      if (error.status === 404) {
        this.$rootScope.show_spinner = false;
        this.showNoConnectionTNIPopup();
      }
    });
  }

  showInvoice() {
    this.$rootScope.show_spinner = true;
    this.Tni.getInvoice(this.currentCompanyId, this.inReserv.bill.invoice_id).then((result) => {
      const blob = b64toBlob(result, 'application/pdf');
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl);
      this.$rootScope.show_spinner = false;
    });
  }

  showNoConnectionTNIPopup() {
    const alert = this.$mdDialog
      .alert()
      .title('TheNextInvoice sync error')
      .textContent('Please, check TheNextInvoice connection')
      .ok('Ok');

    this.$mdDialog.show(alert).then(() => {}, () => {});
  }
}
