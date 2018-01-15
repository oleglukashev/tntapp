export default class SettingsWarningsEditCtrl {
  constructor(User, Settings, item, $modal, $modalInstance, filterFilter) {
    'ngInject';

    this.Settings = Settings;
    this.current_company_id = User.getCompanyId();
    this.filterFilter = filterFilter;

    this.$modal = $modal;
    this.$modalInstance = $modalInstance;

    this.item = item;
    this.form_data = item;
    this.warnings = [];
    this.is_loaded = false;
  }

  submitForm(isValid) {
    if (!isValid) {
      return false;
    }

    this.is_submitting = true;

    const data = {
      text: this.form_data.text,
    };

    this.Settings
      .updateWarning(this.current_company_id, this.form_data.id, data)
      .then(() => {
        this.is_submitting = false;
        this.closeModal();
      }, () => {});

    return true;
  }

  closeModal() {
    this.$modalInstance.dismiss('cancel');
  }
}
