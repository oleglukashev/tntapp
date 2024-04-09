import editSettingsWarningsView from './edit/settings_warnings.edit.view.html';
import editSettingsWarningsController from './edit/settings_warnings.edit.controller';

export default class Controller {
  constructor(User, Settings, $uibModal, $rootScope, filterFilter) {
    'ngInject';

    this.Settings = Settings;
    this.current_company_id = User.getCompanyId();
    this.filterFilter = filterFilter;

    this.$modal = $uibModal;
    this.$rootScope = $rootScope;

    this.warnings = [];

    this.userIsManager = User.isManager.bind(User);
    if (this.userIsManager()) {
      this.loadWarningsSettings();
    } else {
      // no access
      window.location.href = '/';
    }

    this.is_loaded = false;
  }

  loadWarningsSettings() {
    this.Settings
      .getWarningsSettings(this.current_company_id).then(
        (warnings) => {
          this.is_loaded = true;
          this.warnings = warnings;
        });
  }

  editWarning(id) {
    const modalInstance = this.$modal.open({
      template: editSettingsWarningsView,
      controller: editSettingsWarningsController,
      controllerAs: 'ctrl',
      size: 'md',
      backdrop: 'static',
      resolve: {
        item: () => this.filterFilter(this.warnings, { id })[0],
      },
    });

    modalInstance.result.then(() => {}, () => {});
  }
}
