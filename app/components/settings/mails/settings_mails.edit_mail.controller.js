export default class SettingsMailsEditMailCtrl {
  constructor(User, AppConstants, item, Settings, $modalInstance, $rootScope) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Settings = Settings;
    this.$modalInstance = $modalInstance;
    this.$rootScope = $rootScope;

    this.form_data = item;
    this.statuses = AppConstants.mailStatuses;
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

    this.Settings
      .updateMailtext(this.current_company_id, this.form_data.id, data)
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
