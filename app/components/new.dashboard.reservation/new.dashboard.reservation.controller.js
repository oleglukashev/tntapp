export default class Controller {
  constructor(User, Settings, Confirm) {
    'ngInject';

    this.Settings = Settings;
    this.Confirm = Confirm;
    this.tabIndex = 0;
  }

  setType(type) {
    this.type = type;
  }

  closeModalOrConfirm(noConfirm) {
    if (noConfirm) {
      this.dismiss({ $value: 'cancel' });
    } else {
      this.Confirm.onCloseModal(this.dismiss);
    }
  }
}
