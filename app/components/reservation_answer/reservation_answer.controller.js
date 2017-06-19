export default class ReservationsAnswerCtrl {
  constructor(User, ReservationStatus, reservation, today_reservation, group_this_week_reservation,
    action_required_reservations, $modalInstance, $window) {
    'ngInject';

    this.current_company              = User.current_company;
    this.$modalInstance               = $modalInstance;
    this.reservation                  = reservation;
    this.$window                      = $window;
    this.ReservationStatus            = ReservationStatus;
    this.today_reservation            = today_reservation;
    this.group_this_week_reservation  = group_this_week_reservation;
    this.action_required_reservations = action_required_reservations;
  }

  closeModal() {
    this.$modalInstance.dismiss('cancel');
  }

  submitForm(is_valid, state) {
    this.is_submitting = true;

    if (!is_valid) {
      return false;
    }

    this.ReservationStatus
      .changeStatus(this.current_company.id, this.reservation, 'request', this.form_data)
        .then(
          (result) => {
            this.is_submitting = false;
            this.closeModal();
          }, (error) => {
            // error
          });
  }
}
