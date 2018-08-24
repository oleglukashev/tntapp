export default class Controller {
  constructor(User, Settings, item, $uibModal, $rootScope, $uibModalInstance, filterFilter) {
    'ngInject';

    this.Settings = Settings;
    this.current_company_id = User.getCompanyId();
    this.filterFilter = filterFilter;

    this.$modal = $uibModal;
    this.$rootScope = $rootScope;
    this.$modalInstance = $uibModalInstance;

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
        this.$rootScope.show_spinner = false;
        this.closeModal();
      }, () => {
        this.$rootScope.show_spinner = false;
      });

    return true;
  }

  closeModal() {
    this.$modalInstance.dismiss('cancel');
  }
}
