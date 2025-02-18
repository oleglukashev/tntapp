import cronstrue from 'cronstrue';

export default class Controller {
  constructor(User, emails_deliveries, item, EmailsDelivery, $uibModalInstance, $rootScope) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.EmailsDelivery = EmailsDelivery;
    this.$modalInstance = $uibModalInstance;
    this.$rootScope = $rootScope;
    this.emails_deliveries = emails_deliveries;
    this.recipient_conditions = [
      'birthday',
      'all',
      'newsletter_subscribers',
      'reservation_label_wedding',
      'reservation_label_promotion',
      'reservation_label_party',
      'reservation_label_drinks',
      'reservation_label_condolence',
      'reservation_label_company_outing',
    ];
    this.item = Object.assign({}, item);
    this.form_data = {
      cron: item ? item.cron : '0 0 1 * *',
      enabled: item ? item.enabled : true,
      recipient_condition: item ? item.recipient_condition : this.recipient_conditions[0],
      title: item ? item.title : null,
      content: item ? item.content : null,
    };
    this.cronDescription = 'Every minute';
    this.updateCronDescription();
  }

  updateCronDescription() {
    try {
      this.cronDescription = cronstrue.toString(this.form_data.cron);
    } catch(e) {
      this.cronDescription = 'Wrong schedule';
    }
  }

  submitForm(isValid) {
    if (!isValid) {
      return false;
    }

    this.is_submitting = true;
    this.$rootScope.show_spinner = true;

    const data = this.form_data;

    if (this.item.id) {
      this.EmailsDelivery.update(this.current_company_id, data, this.item.id)
        .then((data) => {
          this.is_submitting = false;
          this.$rootScope.show_spinner = false;
          this.emails_deliveries[this.emails_deliveries.findIndex(item => item.id === this.item.id)] = data;
          this.closeModal();
        }, () => {
          this.is_submitting = false;
          this.$rootScope.show_spinner = false;
        });
    } else {
      this.EmailsDelivery.create(this.current_company_id, data)
        .then((data) => {
          this.is_submitting = false;
          this.$rootScope.show_spinner = false;
          this.emails_deliveries.push(data);
          this.closeModal();
        }, () => {
          this.is_submitting = false;
          this.$rootScope.show_spinner = false;
        });
    }

    return true;
  }

  closeModal() {
    this.$modalInstance.dismiss('cancel');
  }

  filter(content) {
    return encodeURIComponent(btoa(content.replace(/>\s+</g, '><')));
  }
}
