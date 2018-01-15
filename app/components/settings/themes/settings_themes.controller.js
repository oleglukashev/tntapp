export default class SettingsThemesCtrl {
  constructor(User, Settings, AppConstants, $rootScope, $cookieStore) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Settings = Settings;
    this.$rootScope = $rootScope;
    this.$cookieStore = $cookieStore;
    this.is_loaded = false;
    this.AppConstants = AppConstants;
    this.plugin_theme_name = this.AppConstants.themes[0];

    this.loadTheme();
  }

  submitForm() {
    const themeClass = `${this.plugin_theme_name.toLowerCase()}-theme`;
    this.Settings.saveThemeToCookie(themeClass);
    this.$rootScope.$broadcast('AppCtrl.change_plugin_theme_name', themeClass);
    this.Settings
      .updateThemeSettings(this.current_company_id, { plugin_theme_name: this.plugin_theme_name });
  }

  loadTheme() {
    this.Settings
      .getThemeSettings(this.current_company_id).then(
        (result) => {
          this.is_loaded = true;

          if (result.plugin_theme_name) {
            this.plugin_theme_name = result.plugin_theme_name;
          }
        },
        () => {
        });
  }
}
