export default class SettingsCustomerSettingsNamesNewCtrl {
  constructor(User, CustomerSettingsName, settingsNames, $modal, $rootScope,
    $modalInstance, $translate) {
    'ngInject';

    this.CustomerSettingsName = CustomerSettingsName;
    this.current_company_id = User.getCompanyId();
    this.$modal = $modal;
    this.$rootScope = $rootScope;
    this.$modalInstance = $modalInstance;
    this.settingsNames = settingsNames;
    this.form_data = {
      type: 'allergy',
      language: $translate.proposedLanguage().toUpperCase() || 'NL',
    };
  }

  submitForm(isValid) {
    if (!isValid) {
      return false;
    }

    this.is_submitting = true;
    this.$rootScope.show_spinner = true;
    this.CustomerSettingsName
      .create(this.current_company_id, this.form_data)
      .then((settingsName) => {
        this.is_submitting = false;
        this.settingsNames.push(settingsName);
        this.$rootScope.show_spinner = false;
        this.$modalInstance.dismiss('cancel');
      }, () => {
        this.is_submitting = false;
        this.$rootScope.show_spinner = false;
      });

    return true;
  }
}
