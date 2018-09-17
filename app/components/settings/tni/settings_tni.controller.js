export default class Controller {
  constructor(User, Settings, Tni, $rootScope) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Settings = Settings;
    this.Tni = Tni;
    this.$rootScope = $rootScope;

    this.loadGeneralSettings();
  }

  submitForm() {
    this.$rootScope.show_spinner = true;

    const data = {
      tni_username: this.form_data.username,
      tni_password: this.form_data.password,
    };

    this.Settings.updateGeneralSettings(this.current_company_id, data).then(() => {
      this.$rootScope.show_spinner = false;
    }, (error) => {
      this.errors = error.data;
    });
  }

  loadGeneralSettings() {
    this.Settings.getGeneralSettings(this.current_company_id).then((settings) => {
      this.form_data = {
        username: settings.tni_username,
        password: settings.tni_password,
      };
    });
  }
}
