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

  getVat() {
    return this.inReserv.products[0].vat * this.inReserv.price / 100;
  }

  getDiscount() {
    return this.inReserv.products.reduce((a, b) => {
      const aDiscount = a.discount || 0;
      const bDiscount = b.discount || 0;

      return aDiscount + bDiscount;
    }, 0);
  }

  getPricesWithVats() {
    const result = {};

    this.inReserv.products.forEach((item) => {
      if (!result[item.vat]) {
        result[item.vat] = 0;
      }

      result[item.vat] += item.price - (item.price / (item.vat / 100 + 1));
    });

    return result;
  }

  getExclPrice() {
    return this.inReserv.price - Object.values(this.getPricesWithVats()).reduce((a, b) => a + b, 0);
  }
}
