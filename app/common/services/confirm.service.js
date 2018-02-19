export default class Confirm {
  constructor($mdDialog, $translate) {
    'ngInject';

    this.$mdDialog = $mdDialog;
    this.remove_text = '';
    this.confirm_text = '';
    this.back_text = '';

    // run translates
    $translate(['remove', 'notifications.settings_escape', 'back']).then((translations) => {
      this.title_text = translations.remove;
      this.confirm_text = translations['notifications.settings_escape'];
      this.back_text = translations.back;
    }, (translationIds) => {
      this.title_text = translationIds.remove;
      this.confirm_text = translationIds['notifications.settings_escape'];
      this.back_text = translationIds.back;
    });
  }

  onCloseModal($modalInstance) {
    const confirm = this.$mdDialog.confirm()
      .title(this.title_text)
      .textContent(this.confirm_text)
      .ok(this.title_text)
      .cancel(this.back_text);

    this.$mdDialog.show(confirm).then(() => {
      $modalInstance.close();
    }, () => {});
  }
}
