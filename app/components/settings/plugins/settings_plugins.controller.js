export default class SettingsPluginsCtrl {
  constructor(User, Settings, $rootScope) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Settings = Settings;
    this.$rootScope = $rootScope;
    this.is_loaded = false;
    this.iframe_widget = '<iframe src="https://dashboard.thenexttable.com/thenexttable-embed/iframe.php?rid=' + this.current_company_id + '" style="display: block; margin: 0 auto;" frameborder="0" seamless="seamless" height="440px;" width="300px;"></iframe>'

    this.loadPluginsSettings();
    this.$rootScope.show_spinner = true;
  }

  loadPluginsSettings() {
    this.Settings
      .getPluginsSettings(this.current_company_id).then(
        (pluginsSettings) => {
          this.$rootScope.show_spinner = false;
          this.is_loaded = true;
          this.api_token = pluginsSettings.api_token.token;
          this.wordpress_token = pluginsSettings.wordpress_token;
          this.tnr_sync_token = pluginsSettings.tnr_sync_token;
        });
  }

  submitForm() {
    this.$rootScope.show_spinner = true;
    this.Settings
      .updateTnrSyncTokenSettings(this.current_company_id, { tnr_sync_token: this.tnr_sync_token })
        .then(
          () => {
            this.$rootScope.show_spinner = false;
          },
          (error) => {
            this.errors = error.data;
          });
  }
}
