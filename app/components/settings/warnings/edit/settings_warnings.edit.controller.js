export default class SettingsWarningsEditCtrl {
  constructor(User, Settings, item, $modal, $rootScope, $modalInstance, filterFilter) {
    'ngInject';

    this.Settings = Settings;
    this.current_company_id = User.getCompanyId();
    this.filterFilter = filterFilter;

    this.$modal = $modal;
    this.$rootScope = $rootScope;
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

    const data = {
      text: this.form_data.text,
    };

    this.is_submitting = true;
    this.$rootScope.show_spinner = true;
    this.Settings
      .updateWarning(this.current_company_id, this.form_data.id, data)
      .then(() => {
        this.is_submitting = false;
        this.$rootScope.show_spinner = true;
        this.closeModal();
      }, () => {
        this.$rootScope.show_spinner = true;
      });

    return true;
  }

  closeModal() {
    this.$modalInstance.dismiss('cancel');
  }
}
