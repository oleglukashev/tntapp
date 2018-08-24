export default class Controller {
  constructor(User, Confirm, Settings) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Settings = Settings;
    this.Confirm = Confirm;

    this.$onInit = () => {
      this.Settings.getGeneralSettings(this.current_company_id)
        .then((generalSettings) => {
          this.settings = generalSettings;
        });
    };
  }

  closeModalOrConfirm(noConfirm) {
    if (noConfirm) {
      this.dismiss({ $value: 'cancel' });
    } else {
      this.Confirm.onCloseModal(this.dismiss);
    }
  }
}
