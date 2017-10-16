export default class ReservationsAnswerCtrl {
  constructor(User, ReservationStatus, reservation, $modalInstance, $window) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.$modalInstance = $modalInstance;
    this.reservation = reservation;
    this.$window = $window;
    this.ReservationStatus = ReservationStatus;
  }

  closeModal() {
    this.$modalInstance.dismiss('cancel');
  }

  cancelWithoutMail() {
    this.is_submitting = true;
    this.closeModal();

    return this.ReservationStatus
      .changeStatus(this.current_company_id, this.reservation, 'cancelled').then(
        () => {
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
        this.closeModal();
      }, () => {});
  }
}
