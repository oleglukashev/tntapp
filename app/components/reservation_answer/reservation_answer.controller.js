export default class ReservationsAnswerCtrl {
  constructor(User, ReservationStatus, reservation, $modalInstance, Settings,
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
    this.Settings = Settings;
    this.filterFilter = filterFilter;
    this.form_data = {};
    this.type_by_status = {
      request: 'reservering_ontvangen',
      confirmed: 'reservering_bevestigd',
      cancelled: 'reservering_niet_mogelijk',
    };

    if (this.status && this.type_by_status[this.status]) {
      this.loadMailsTextsSettings(this.type_by_status[this.status]);
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

  submitForm(isValid) {
    if (!isValid) {
      return false;
    }

    this.is_submitting = true;
    this.$rootScope.show_spinner = true;
    return this.changeStatus(this.reservation, this.status).then(() => {
      this.ReservationStatus
        .sendMail(this.current_company_id, this.reservation, this.form_data).then(() => {
          this.$rootScope.show_spinner = false;
          this.closeModal();
          this.is_submitting = false;
        }, () => {
          this.$rootScope.show_spinner = false;
          this.is_submitting = false;
        });
    });
  }

  loadMailsTextsSettings(type) {
    this.Settings.getMailsTextsSettings(this.current_company_id)
      .then(
        (mailsSettings) => {
          this.mails_texts_settings = mailsSettings;
          const currentMail = this.filterFilter(mailsSettings, { type, language: 'NL' })[0];

          if (currentMail) {
            this.form_data.title = currentMail.title;
            this.form_data.content = currentMail.content;
          }
        });
  }
}
