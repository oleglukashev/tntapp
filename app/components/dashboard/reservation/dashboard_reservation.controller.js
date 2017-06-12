export default class DashboardReservationCtrl {
  constructor($modalInstance) {
    this.$modalInstance = $modalInstance;
  }

  closeModal() {
    this.$modalInstance.dismiss('cancel');
  }
}
