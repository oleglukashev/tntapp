export default class SettingsWarningsCtrl {
  constructor(User, Settings, $modal, $rootScope, filterFilter) {
    'ngInject';

    this.Settings = Settings;
    this.current_company_id = User.getCompanyId();
    this.filterFilter = filterFilter;

    this.$modal = $modal;
    this.$rootScope = $rootScope;

    this.warnings = [];

    this.loadWarningsSettings();

    this.is_loaded = false;
    this.$rootScope.show_spinner = true;
  }

  loadWarningsSettings() {
    this.Settings
      .getWarningsSettings(this.current_company_id).then(
        (warnings) => {
          this.is_loaded = true;
          this.$rootScope.show_spinner = false;
          this.warnings = warnings;
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
