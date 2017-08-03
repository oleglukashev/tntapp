export default class SettingsMailsEditMailCtrl {
  constructor(User, AppConstants, item, Settings, $modalInstance) {
    'ngInject';

    this.current_company = User.current_company;
    this.Settings = Settings;
    this.$modalInstance = $modalInstance;

    this.form_data = item;
    this.statuses = AppConstants.mailStatuses;
  }

  submitForm(isValid) {
    if (!isValid) {
      return false;
    }

    this.is_submitting = true;

    const data = {
      title: this.form_data.title,
      content: this.form_data.content,
    };

    this.Settings
      .updateMailtext(this.current_company.id, this.form_data.id, data)
        .then(() => {
          this.is_submitting = false;
          this.$modalInstance.dismiss('cancel');
        }, () => {
          // nothing
        });

    return true;
  }

  closeModal() {
    this.$modalInstance.dismiss('cancel');
  }
}
