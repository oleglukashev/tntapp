export default class DashboardReservationsReservationCtrl {
  constructor($modalInstance, Confirm) {
    'ngInject';

    this.Confirm = Confirm;
    this.$modalInstance = $modalInstance;
  }

  closeModalOrConfirm(noConfirm) {
    if (noConfirm) {
      this.$modalInstance.dismiss('cancel');
    } else {
      this.Confirm.onCloseModal(this.$modalInstance);
    }
  }
}
