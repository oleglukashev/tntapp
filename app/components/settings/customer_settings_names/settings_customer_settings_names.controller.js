import customerSettingsNamesFormTemplate from './settings_customer_settings_names.form.view.html';

export default class SettingsCustomerSettingsnamesCtrl {
  constructor(User, CustomerSettingsName, $rootScope, $modal, $translate, filterFilter) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.CustomerSettingsName = CustomerSettingsName;
    this.$rootScope = $rootScope;
    this.$modal = $modal;
    this.filterFilter = filterFilter;
    this.$rootScope.show_spinner = true;
    this.is_loaded = false;
    this.settingsNames = [];
    this.loadNames();

    // run translates
    $translate('are_you_sure').then((areYouSure) => {
      this.confirm_text = areYouSure;
    }, (translationIds) => {
      this.confirm_text = translationIds;
    });
  }

  loadNames() {
    this.CustomerSettingsName.getAll(this.current_company_id).then((settingsNames) => {
      this.settingsNames = settingsNames;
      this.$rootScope.show_spinner = false;
      this.is_loaded = true;
    }, () => {
      this.$rootScope.show_spinner = false;
    });
  }

  edit(index) {
    const modalInstance = this.$modal.open({
      template: customerSettingsNamesFormTemplate,
      controller: 'SettingsCustomerSettingsNamesEditCtrl as controller',
      size: 'md',
      resolve: {
        settingsName: () => this.settingsNames[index],
      },
    });

    modalInstance.result.then(() => {}, () => {});
  }

  delete(index) {
    this.is_submitting = true;
    this.$rootScope.show_spinner = true;
    const settingsName = this.settingsNames[index];

    this.CustomerSettingsName
      .delete(this.current_company_id, settingsName.id).then(() => {
        this.is_submitting = false;
        this.$rootScope.show_spinner = false;
        this.settingsNames.splice(index, 1);
      }, () => {
        this.is_submitting = false;
        this.$rootScope.show_spinner = false;
      });
  }

  add() {
    const modalInstance = this.$modal.open({
      template: customerSettingsNamesFormTemplate,
      controller: 'SettingsCustomerSettingsNamesNewCtrl as controller',
      size: 'md',
      resolve: {
        settingsNames: () => this.settingsNames,
      },
    });

    modalInstance.result.then(() => {}, () => {});
  }

  showConfirm(index) {
    if (confirm(this.confirm_text)) {
      this.delete(index);
    }
  }
}
