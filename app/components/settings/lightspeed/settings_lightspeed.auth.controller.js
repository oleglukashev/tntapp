export default class Controller {
  constructor(User, Settings, $rootScope, $uibModalInstance) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Settings = Settings;
    this.$rootScope = $rootScope;
    this.$modalInstance = $uibModalInstance;
    this.$rootScope.show_spinner = false;

    this.loadGeneralSettings();
  }

  submitForm() {
    this.$rootScope.show_spinner = true;

    const data = {
      lightspeed_username: this.form_data.username,
      lightspeed_password: this.form_data.password,
    };

    this.Settings.updateGeneralSettings(this.current_company_id, data).then((result) => {
      this.settings = result.data;
      this.form_data = { username: this.settings.tni_username, password: atob(this.settings.tni_password) };
      this.$rootScope.show_spinner = false;
      this.$modalInstance.close();
    }, (error) => {
      this.errors = error.data;
    });
  }

  removeLightspeedData() {
    this.$rootScope.show_spinner = true;
    const data = { lightspeed_username: null, lightspeed_password: null };

    this.Settings.updateGeneralSettings(this.current_company_id, data).then((result) => {
      this.settings = result.data;
      this.form_data = data;
      this.$rootScope.show_spinner = false;
    }, (error) => {
      this.errors = error.data;
    });
  }

  loadGeneralSettings() {
    this.Settings.getGeneralSettings(this.current_company_id).then((settings) => {
      this.settings = settings;
      this.form_data = {
        username: settings.lightspeed_username,
        password: atob(settings.lightspeed_password),
      };
      this.is_loaded = true;
    });
  }

  isLightspeedDataExist() {
    return this.settings.lightspeed_username || this.settings.lightspeed_password;
  }
}
