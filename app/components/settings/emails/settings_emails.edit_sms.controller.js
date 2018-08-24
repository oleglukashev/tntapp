export default class Controller {
  constructor(User, item, SmsText, $uibModalInstance, $rootScope) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.SmsText = SmsText;
    this.$modalInstance = $uibModalInstance;
    this.$rootScope = $rootScope;
    this.form_data = item;
  }

  submitForm(isValid) {
    if (!isValid) {
      return false;
    }

    this.is_submitting = true;
    this.$rootScope.show_spinner = true;

    const data = {
      content: this.form_data.content,
    };

    this.SmsText.update(this.current_company_id, this.form_data.id, data)
      .then(() => {
        this.is_submitting = false;
        this.$rootScope.show_spinner = false;
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
