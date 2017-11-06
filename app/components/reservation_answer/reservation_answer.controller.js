export default class ReservationsAnswerCtrl {
  constructor(User, ReservationStatus, reservation, $modalInstance, Settings,
    filterFilter, $rootScope, $window, isCancellingReservation) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.User = User;
    this.$modalInstance = $modalInstance;
    this.reservation = reservation;
    this.isCancellingReservation = isCancellingReservation;
    this.$rootScope = $rootScope;
    this.$window = $window;
    this.ReservationStatus = ReservationStatus;
    this.Settings = Settings;
    this.filterFilter = filterFilter;
    this.form_data = {};

    if (this.isCancellingReservation) {
      this.loadMailsTextsSettings();
    }
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

  loadMailsTextsSettings() {
    this.Settings.getMailsTextsSettings(this.current_company_id)
      .then(
        (mailsSettings) => {
          this.mails_texts_settings = mailsSettings;
          const currentMail = this.filterFilter(mailsSettings, { type: 'reservering_ontvangen', language: 'NL' })[0];

          if (currentMail) {
            const fullName = `${this.reservation.customer.first_name} ${this.reservation.customer.last_name}`;
            let content = currentMail
              .content
              .replace('%VOORNAAM%', fullName);

            const company = this.User.getCompany(this.current_company_id);
            if (company) {
              content = content.replace('%RESTAURANTNAAM%', company.name);
            }

            this.form_data.title = currentMail.title;
            this.form_data.content = content;
          }
        });
  }
}
