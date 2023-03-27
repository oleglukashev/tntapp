export default class Controller {
  constructor(User, news_deliveries, NewsDelivery, $uibModalInstance, $rootScope) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.NewsDelivery = NewsDelivery;
    this.$modalInstance = $uibModalInstance;
    this.$rootScope = $rootScope;
    this.form_data = {};
    this.news_deliveries = news_deliveries;
  }

  submitForm(isValid) {
    if (!isValid) {
      return false;
    }

    this.is_submitting = true;
    this.$rootScope.show_spinner = true;

    const data = {
      title: this.form_data.title,
      content: this.form_data.content,
    };

    this.NewsDelivery.create(this.current_company_id, data)
      .then((data) => {
        this.is_submitting = false;
        this.$rootScope.show_spinner = false;
        this.news_deliveries.push(data);
        this.closeModal();
      }, () => {
        this.is_submitting = false;
        this.$rootScope.show_spinner = false;
      });

    return true;
  }

  closeModal() {
    this.$modalInstance.dismiss('cancel');
  }
}
