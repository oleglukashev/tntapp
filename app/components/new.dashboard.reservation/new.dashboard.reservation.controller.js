export default class Controller {
  constructor(User, Settings, Confirm) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Settings = Settings;
    this.Confirm = Confirm;
    this.tabIndex = 0;

    this.Settings.getGeneralSettings(this.current_company_id)
      .then((generalSettings) => {
        this.initGeneralSettings(generalSettings);
      });
  }

  setType(type) {
    this.type = type;
  }

  initGeneralSettings(generalSettings) {
    this.settings = generalSettings;
  }

  closeModalOrConfirm(noConfirm) {
    if (noConfirm) {
      this.dismiss({ $value: 'cancel' });
    } else {
      this.Confirm.onCloseModal(this.dismiss);
    }
  }
}
