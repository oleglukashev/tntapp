export default class ReservationsAnswerCtrl {
  constructor(User, ReservationStatus, reservation, $modalInstance, EmailText,
    filterFilter, $rootScope, $window, status) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.User = User;
    this.$modalInstance = $modalInstance;
    this.reservation = reservation;
    this.status = status;
    this.$rootScope = $rootScope;
    this.$window = $window;
    this.ReservationStatus = ReservationStatus;
    this.EmailText = EmailText;
    this.filterFilter = filterFilter;
    this.form_data = {};
    this.type_by_status = {
      request: 'reservering_ontvangen',
      confirmed: 'reservering_bevestigd',
      cancelled: 'reservering_niet_mogelijk',
    };

    if (this.status && this.type_by_status[this.status]) {
      this.loadEmailTexts(this.type_by_status[this.status]);
    }
  }

  changeStatus() {
    return this.ReservationStatus
      .changeStatus(this.current_company_id, this.reservation, this.status).then(() => {
        this.$rootScope.$broadcast('reservationStatusChanged', {
          reservation: this.reservation,
          status: this.status,
        });
      }, () => {});
  }

  closeModal() {
    this.$modalInstance.dismiss('cancel');
  }

  changeStatusWithoutSendEmail() {
    this.is_submitting = true;
    this.$rootScope.show_spinner = true;
    return this.changeStatus().then(() => {
      this.$rootScope.show_spinner = false;
      this.closeModal();
      this.is_submitting = false;
    });
  }

  sendEmail() {
    this.ReservationStatus
      .sendMail(this.current_company_id, this.reservation, this.form_data).then(() => {
        this.$rootScope.show_spinner = false;
        this.closeModal();
        this.is_submitting = false;
      }, () => {
        this.$rootScope.show_spinner = false;
        this.is_submitting = false;
      });
  }

  submitForm(isValid) {
    if (!isValid) {
      return false;
    }

    this.is_submitting = true;
    this.$rootScope.show_spinner = true;

    if (this.status) {
      this.changeStatus(this.reservation, this.status).then(() => {
        this.sendEmail();
      });
    } else {
      this.sendEmail();
    }
  }

  loadEmailTexts(type) {
    this.EmailText.getAll(this.current_company_id).then((emailTexts) => {
      const currentEmail = this.filterFilter(emailTexts, { type, language: 'NL' })[0];

      if (currentEmail) {
        this.form_data.title = currentEmail.title;
        this.form_data.content = currentEmail.content;
      }
    });
  }
}
