export default class Controller {
  constructor(User, Untill, $mdDialog, $rootScope, $interval, $state) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Untill = Untill;
    this.$mdDialog = $mdDialog;
    this.$rootScope = $rootScope;
    this.$state = $state;
    this.is_loaded = false;

    this.userIsManager = User.isManager.bind(User);
    if (this.userIsManager()) {
      this.loadUntillSettings();
    } else {
      // no access
      window.location.href = '/';
    }
  }

  loadUntillSettings() {
    this.Untill
      .getSettings(this.current_company_id).then(
        (settings) => {
          this.is_loaded = true;
          this.untill_login = settings.untill_login;
          this.untill_password = settings.untill_password;
          this.untill_server = settings.untill_server;
        });
  }

  submitFormUntill(isValid) {
    if (!isValid) {
      return false;
    }

    this.is_submited = true;
    this.$rootScope.show_spinner = true;

    this.Untill
      .updateSettings(this.current_company_id, {
        untill_login: this.untill_login,
        untill_password: this.untill_password,
        untill_server: this.untill_server,
      })
        .then(
          (plugins_settings) => {
            this.$rootScope.show_spinner = false;
            
            if (plugins_settings.error) {
              this.showUntillWrongCredentialsAlert();
            } else {
              this.$state.go('app.settings.untill');
            }
          }, (error) => {
            this.$rootScope.show_spinner = false;
            this.errors = error;

            this.showUntillWrongCredentialsAlert();
        });
  }

  removeLink() {
    this.$rootScope.show_spinner = true;

    this.Untill
      .deleteConnection(this.current_company_id)
        .then(
          (plugins_settings) => {
            this.$state.go('app.settings.plugins');
          }, () => {});
  }

  showUntillWrongCredentialsAlert() {
    const alert = this.$mdDialog
      .alert()
      .title('Untill credintails error')
      .textContent('Please, check Untill credintails')
      .ok('Ok');

    this.$mdDialog.show(alert).then(() => {}, () => {});    
  }
}
