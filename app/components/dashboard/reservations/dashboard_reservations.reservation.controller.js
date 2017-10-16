export default class DashboardReservationsReservationCtrl {
  constructor($modalInstance, Confirm) {
    'ngInject';

    this.Confirm = Confirm;
    this.$modalInstance = $modalInstance;
  }

  closeModal() {
    this.$modalInstance.dismiss('cancel');
  }
}
