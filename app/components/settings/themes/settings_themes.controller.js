export default class SettingsThemesCtrl {
  constructor(User, Settings, AppConstants, $rootScope, $cookieStore) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Settings = Settings;
    this.$rootScope = $rootScope;
    this.$cookieStore = $cookieStore;
    this.AppConstants = AppConstants;
    this.plugin_theme_name = this.AppConstants.themes[0];

    this.loadTheme();

    this.is_loaded = false;
    this.$rootScope.show_spinner = true;
  }

  submitForm() {
    const themeClass = `${this.plugin_theme_name.toLowerCase()}-theme`;
    this.Settings.saveThemeToCookie(themeClass);
    this.$rootScope.$broadcast('AppCtrl.change_plugin_theme_name', themeClass);
    this.$rootScope.show_spinner = true;
    this.Settings
      .updateThemeSettings(this.current_company_id, { plugin_theme_name: this.plugin_theme_name })
        .then(() => {
          this.$rootScope.show_spinner = false;
        }, () => {
          this.$rootScope.show_spinner = false;
        });
  }

  loadTheme() {
    this.Settings
      .getThemeSettings(this.current_company_id).then(
        (result) => {
          this.is_loaded = true;
          this.$rootScope.show_spinner = false;

          if (result.plugin_theme_name) {
            this.plugin_theme_name = result.plugin_theme_name;
          }
        },
        () => {
          this.$rootScope.show_spinner = false;
        });
  }
}
