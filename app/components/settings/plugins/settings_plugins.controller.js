export default class SettingsPluginsCtrl {
  constructor(User, Settings) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Settings        = Settings;
    this.is_loaded       = false;
    this.iframe_widget   = '<iframe src="https://dashboard.thenexttable.com/thenexttable-embed/iframe.php?rid=' + this.current_company_id + '" style="display: block; margin: 0 auto;" frameborder="0" seamless="seamless" height="440px;" width="300px;"></iframe>'

    this.loadPluginsSettings();
  }

  loadPluginsSettings() {
    this.Settings
      .getPluginsSettings(this.current_company_id)
        .then(
          (plugins_settings) => {
            this.is_loaded       = true;
            this.api_token       = plugins_settings.api_token.token;
            this.wordpress_token = plugins_settings.wordpress_token;
            this.tnr_sync_token  = plugins_settings.tnr_sync_token;
          });
  }

  submitForm() {
    this.Settings
      .updateTnrSyncTokenSettings(this.current_company_id, { tnr_sync_token: this.tnr_sync_token })
        .then(
          (plugins_settings) => {
            //nothing
          }, (error) => {
            this.errors = error.data;
          });
  }
}