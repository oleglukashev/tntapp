export default class Controller {
  constructor(User, Theme, Settings, AppConstants, $rootScope, $cookieStore) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Settings = Settings;
    this.User = User;
    this.Theme = Theme;
    this.$rootScope = $rootScope;
    this.$cookieStore = $cookieStore;
    this.AppConstants = AppConstants;
    this.plugin_theme_name = Theme.get();

    this.userIsManager = User.isManager.bind(User);
    if (!this.userIsManager()) {
      // no access
      window.location.href = '/';
    }
  }

  submitForm() {
    this.$rootScope.show_spinner = true;
    this.Settings
      .updateThemeSettings(this.current_company_id, { plugin_theme_name: this.plugin_theme_name })
        .then(() => {
          this.Theme.save(this.plugin_theme_name.toLowerCase());
          this.$rootScope.show_spinner = false;
        }, () => {
          this.$rootScope.show_spinner = false;
        });
  }
}
