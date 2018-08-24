export default class Controller {
  constructor(User, CustomerSettingsName, settingsName, $uibModal, $rootScope, $uibModalInstance) {
    'ngInject';

    this.CustomerSettingsName = CustomerSettingsName;
    this.current_company_id = User.getCompanyId();
    this.$modal = $uibModal;
    this.$rootScope = $rootScope;
    this.$modalInstance = $uibModalInstance;
    this.settingsName = settingsName;
    this.form_data = {
      value: settingsName.value,
      type: settingsName.type,
      language: settingsName.language,
    };
  }

  submitForm(isValid) {
    if (!isValid) {
      return false;
    }

    this.is_submitting = true;
    this.$rootScope.show_spinner = true;
    this.CustomerSettingsName
      .update(this.current_company_id, this.settingsName.id, this.form_data)
      .then((settingsName) => {
        this.is_submitting = false;
        this.$rootScope.show_spinner = false;
        this.settingsName.value = settingsName.value;
        this.settingsName.type = settingsName.type;
        this.settingsName.language = settingsName.language;
        this.$modalInstance.dismiss('cancel');
      }, () => {
        this.is_submitting = false;
        this.$rootScope.show_spinner = false;
      });

    return true;
  }
}
