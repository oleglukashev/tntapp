import b64toBlob from 'b64-to-blob';

export default class Controller {
  constructor(User, Tni, inReserv, $rootScope, $mdDialog, $translate) {
    'ngInject';

    this.currentCompanyId = User.getCompanyId();
    this.inReserv = inReserv;
    this.Tni = Tni;
    this.$mdDialog = $mdDialog;
    this.$rootScope = $rootScope;

    $translate([
      'integration_bill.tni_connection_title_error',
      'integration_bill.tni_connection_title_body',
      'integration_bill.tni_bill_sent_title',
      'integration_bill.tni_bill_sent_body']).then((translates) => {
      this.tni_connection_title_error = translates['integration_bill.tni_connection_title_error'];
      this.tni_connection_title_body = translates['integration_bill.tni_connection_title_body'];
      this.tni_bill_sent_title = translates['integration_bill.tni_bill_sent_title'];
      this.tni_bill_sent_body = translates['integration_bill.tni_bill_sent_body'];
    }, (translationIds) => {
      this.tni_connection_title_error = translationIds['integration_bill.tni_connection_title_error'];
      this.tni_connection_title_body = translationIds['integration_bill.tni_connection_title_body'];
      this.tni_bill_sent_title = translationIds['integration_bill.tni_bill_sent_title'];
      this.tni_bill_sent_body = translationIds['integration_bill.tni_bill_sent_body'];
    });
  }

  close() {
    this.$mdDialog.cancel();
  }

  sendInvoice() {
    this.$rootScope.show_spinner = true;
    this.Tni.sendInvoice(this.currentCompanyId, this.inReserv.id).then((bill) => {
      this.$rootScope.show_spinner = false;
      this.inReserv.bill = bill;
      this.showSuccessTNIPopup();
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

  showSuccessTNIPopup() {
    const alert = this.$mdDialog
      .alert()
      .title(this.tni_bill_sent_title)
      .textContent(this.tni_bill_sent_body)
      .ok('Ok');

    this.$mdDialog.show(alert).then(() => {}, () => {});
  }

  showNoConnectionTNIPopup() {
    const alert = this.$mdDialog
      .alert()
      .title(this.tni_connection_title_error)
      .textContent(this.tni_connection_title_body)
      .ok('Ok');

    this.$mdDialog.show(alert).then(() => {}, () => {});
  }

  getVat() {
    return this.inReserv.products[0].vat * this.inReserv.price / 100;
  }

  getDiscount() {
    return this.inReserv
      .products
      .map(inReservationProduct => inReservationProduct.discount)
      .reduce((a, b) => {
        const aDiscount = a || 0;
        const bDiscount = b || 0;

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
