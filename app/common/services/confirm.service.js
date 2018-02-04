export default class Confirm {
  constructor($mdDialog) {
    'ngInject';

    this.$mdDialog = $mdDialog;
  }

  onCloseModal($modalInstance) {
    const confirm = this.$mdDialog.confirm()
      .title('Verwijderen')
      .textContent('Het huidige werk is niet afgerond en wordt daarom niet opgeslagen')
      .ok('Verwijderen')
      .cancel('Terug');

    this.$mdDialog.show(confirm).then(() => {
      $modalInstance.close();
    }, () => {});
  }
}
