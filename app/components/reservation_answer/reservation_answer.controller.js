export default class ReservationsAnswerCtrl {
  constructor(
    User, ReservationStatus, reservation, $modalInstance,
    $rootScope, $window, isCancellingReservation,
  ) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.$modalInstance = $modalInstance;
    this.reservation = reservation;
    this.isCancellingReservation = isCancellingReservation;
    this.$rootScope = $rootScope;
    this.$window = $window;
    this.ReservationStatus = ReservationStatus;
  }

  closeModal() {
    this.$modalInstance.dismiss('cancel');
  }

  cancelReservation() {
    this.is_submitting = true;
    this.closeModal();

    return this.ReservationStatus
      .changeStatus(this.current_company_id, this.reservation, 'cancelled').then(() => {
        this.$rootScope.$broadcast('NewReservationCtrl.reset_reservation');
        this.is_submitting = false;
      }, () => {
      });
  }

  submitForm(isValid) {
    this.is_submitting = true;

    if (!isValid) {
      return false;
    }

    return this.ReservationStatus
      .sendMail(this.current_company_id, this.reservation, this.form_data).then(() => {
        this.is_submitting = false;
        if (this.isCancellingReservation) {
          this.cancelReservation();
        } else {
          this.closeModal();
        }
      }, () => {});
  }
}
