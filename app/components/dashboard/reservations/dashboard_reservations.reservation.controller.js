export default class DashboardReservationsReservationCtrl {
  constructor($modalInstance, $rootScope) {
    'ngInject';

    this.$modalInstance = $modalInstance;
  }

  closeModal() {
    this.$modalInstance.dismiss('cancel');
  }
}