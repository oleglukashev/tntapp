export default class SettingsWarningsCtrl {
  constructor(User, Settings, $modal, filterFilter) {
    'ngInject';

    this.Settings = Settings;
    this.current_company_id = User.getCompanyId();
    this.filterFilter = filterFilter;

    this.$modal = $modal;

    this.warnings = [];
    this.is_loaded = false;

    this.loadWarningsSettings();
  }

  loadWarningsSettings() {
    this.Settings
      .getWarningsSettings(this.current_company_id).then(
        (warnings) => {
          this.warnings = warnings;
          this.is_loaded = true;
        });
  }

  editWarning(id) {
    const modalInstance = this.$modal.open({
      templateUrl: 'settings_warnings.edit.view.html',
      controller: 'SettingsWarningsEditCtrl as edit_warnings',
      size: 'md',
      resolve: {
        item: () => this.filterFilter(this.warnings, { id })[0],
      },
    });

    modalInstance.result.then(() => {}, () => {});
  }
}
