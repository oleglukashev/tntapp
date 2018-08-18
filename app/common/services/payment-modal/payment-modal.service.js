import template from './payment-modal.view.html';

function PaymentController($timeout, $state, $rootScope, $location, $sce, User, company, days) {
  'ngInject';

  this.days = days;
  this.fields = [];
  this.$rootScope = $rootScope;
  this.$rootScope.show_spinner = false;
  this.$sce = $sce;

  this.submitForm = (form) => {
    this.$rootScope.show_spinner = true;

    User.startSubscription(company.id).then((data) => {
      data = data.buckaroo_data;
      const brqUrl = this.finishUrl(company.id, data.brq_invoicenumber);

      data.brq_return = brqUrl;
      data.brq_returncancel = brqUrl;
      data.brq_returnerror = brqUrl;
      data.brq_returnreject = brqUrl;

      this.fields = Object.keys(data).map(k => ({ name: k, value: data[k] }));
    }, () => {
      this.$rootScope.show_spinner = false;
    }).then(() => {
      $timeout(() => $(`form[name="${form.$name}"`).submit(), 1000);
    });
  };

  this.finishUrl = (companyId, invoiceNumber) =>
    `${API_URL}/company/${companyId}/subscription/finish?transaction_id=${invoiceNumber}`;

  this.getUrl = () => this.$sce.trustAsResourceUrl(BUCKAROO_URL);
}

export default class PaymentModal {
  constructor($uibModal, modalOptionsFactory) {
    'ngInject';

    this.$modal = $uibModal;
    this.modalOptionsFactory = modalOptionsFactory;
  }

  show(company, days) {
    const modalInstance = this.$modal.open(this.modalOptionsFactory({
      template,
      windowClass: 'subscription-modal', // components/subscription/subscription.style.styl
      controller: PaymentController,
      controllerAs: 'payment',
      resolve: {
        days: () => days,
        company: () => company,
      },
    }, days > 0));

    modalInstance.result.then(() => {}, () => {});
  }
}
