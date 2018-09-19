export default class Controller {
  constructor(User, Settings, Tni, $rootScope, $mdDialog) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Settings = Settings;
    this.Tni = Tni;
    this.$rootScope = $rootScope;
    this.$mdDialog = $mdDialog;
    this.settings = {};

    this.loadGeneralSettings();
  }

  submitForm(isValid) {
    if (!isValid) {
      return false;
    }

    this.$rootScope.show_spinner = true;

    const data = { tni_username: this.form_data.username, tni_password: this.form_data.password };

    this.Tni.accountIsValid(this.current_company_id, data).then((result) => {
      if (result) {
        this.Settings.updateGeneralSettings(this.current_company_id, data).then((result) => {
          this.settings = result.data;
          this.form_data = { username: this.settings.tni_username, password: atob(this.settings.tni_password) };
        }, (error) => {
          this.errors = error.data;
        });
      } else {
        this.showNoConnectionPopup();
      }

      this.$rootScope.show_spinner = false;
    }, () => {
      this.showNoConnectionPopup();
      this.$rootScope.show_spinner = false;
    });
  }

  removeTniData() {
    this.$rootScope.show_spinner = true;
    const data = { tni_username: null, tni_password: null };

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
      this.form_data = { username: settings.tni_username, password: atob(settings.tni_password) };
      this.is_loaded = true;
    });
  }

  isTniDataExist() {
    return this.settings.tni_username || this.settings.tni_password;
  }

  showNoConnectionPopup() {
    const alert = this.$mdDialog
      .alert()
      .title('TheNextInvoice sync error')
      .textContent('Please, check TheNextInvoice connection')
      .ok('Ok');

    this.$mdDialog.show(alert).then(() => {}, () => {});
  }
}
