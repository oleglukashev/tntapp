export default class SettingsLightspeedAuthCtrl {
  constructor(User, Settings, $rootScope, $modalInstance) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Settings = Settings;
    this.$rootScope = $rootScope;
    this.$modalInstance = $modalInstance;
    this.$rootScope.show_spinner = false;

    this.loadGeneralSettings();
  }

  submitForm() {
    this.$rootScope.show_spinner = true;

    const data = {
      lightspeed_username: this.form_data.username,
      lightspeed_password: this.form_data.password,
    };

    this.Settings
      .updateGeneralSettings(this.current_company_id, data).then(
        () => {
          this.$rootScope.show_spinner = false;
          this.$modalInstance.close();
        }, (error) => {
          this.errors = error.data;
        });
  }

  loadGeneralSettings() {
    this.Settings
      .getGeneralSettings(this.current_company_id).then(
        (settings) => {
          this.form_data = {
            username: settings.lightspeed_username,
            password: settings.lightspeed_password,
          };
        });
  }
}
