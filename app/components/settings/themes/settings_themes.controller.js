export default class SettingsThemesCtrl {
  constructor(User, Settings) {
    'ngInject';

    this.current_company   = User.current_company;
    this.Settings          = Settings;
    this.is_loaded         = false;
    this.themes            = ['Default', 'Aqua', 'Lego', 'Chocolate'];
    this.plugin_theme_name = this.themes[0];

    this.loadTheme();
  }

  submitForm() {
    this.Settings
      .updateThemeSettings(this.current_company.id, { plugin_theme_name: this.plugin_theme_name })
  }

  loadTheme() {
    this.Settings
      .getThemeSettings(this.current_company.id)
        .then(
            (result) => {
              this.is_loaded = true;

              if (result.plugin_theme_name) {
                this.plugin_theme_name = result.plugin_theme_name;
              }
            },
            (error) => {
              //nothing
            });
  }
}