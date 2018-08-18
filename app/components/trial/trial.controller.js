export default class Controller {
  constructor($scope, $rootScope, moment, User, PaymentModal) {
    'ngInject';

    const company = User.current_company;

    this.trial = company && company.subscription.status === 'pending';
    if (!this.trial) {
      return;
    }

    this.days = 7 - moment().diff(company.subscription.started_on, 'days');
    if (this.days <= 0) {
      this.days = 0;
    }

    PaymentModal.show(company, this.days);
  }
}
