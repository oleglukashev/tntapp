export default class Controller {
  constructor($state, Settings, Untill, $stateParams, $window, User) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Settings = Settings;
    this.Untill = Untill;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$window = $window;

    if (this.$state.current.name.indexOf('app.settings') >= 0 && !User.isManager()) {
      this.$state.go('app.dashboard');
    }

    this.loadUntillSettings();

    this.pages = {
      'settings.general.title': 'app.general_settings',
      'settings.customer_settings_names.title': 'app.customer_names_settings',
      'settings.emails.title': 'app.emails_settings',
      'settings.products.title': 'app.products_settings',
      'settings.limits.title': 'app.limits_settings',
      'settings.employees.title': 'app.employees_settings',
      'settings.tables.title': 'app.tables_settings',
      'settings.plugins.title': 'app.plugins_settings',
      'settings.warnings.title': 'app.warnings_settings',
      'settings.themes.title': 'app.themes_settings',
      'settings.lightspeed.title': 'app.lightspeed_settings',
      'settings.tni.title': 'app.tni_settings',
    };
  }

  loadUntillSettings() {
    this.Untill.getSettings(this.current_company_id).then((settings) => {
      if (settings.untill_login) {
        this.pages.Untill = 'app.untill_settings';
      }
    });
  }
}
