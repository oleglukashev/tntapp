export default class DashboardReservationsReservationCtrl {
  constructor($modalInstance) {
    'ngInject';
    
    this.$modalInstance = $modalInstance;
  }
  
  closeModal() {
    this.$modalInstance.dismiss('cancel');
  }
}