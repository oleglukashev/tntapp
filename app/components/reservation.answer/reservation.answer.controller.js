export default class Controller {
  constructor(User, ReservationStatus, EmailText, filterFilter, $rootScope) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.$rootScope = $rootScope;
    this.ReservationStatus = ReservationStatus;
    this.EmailText = EmailText;
    this.filterFilter = filterFilter;
    this.form_data = {};
    this.type_by_status = {
      request: 'reservering_ontvangen',
      confirmed: 'reservering_bevestigd',
      cancelled: 'reservering_niet_mogelijk',
    };

    this.$onInit = () => {
      this.reservation = this.resolve.reservation;
      this.status = this.resolve.status;
      this.changeStatus = this.resolve.changeStatus;

      if (this.status && this.type_by_status[this.status]) {
        this.loadEmailTexts(this.type_by_status[this.status]);
      }
    }
  }

  changeStatusWithoutSendEmail() {
    this.is_submitting = true;
    this.$rootScope.show_spinner = true;
    return this.changeStatus({ reservation: this.reservation, status: this.status }).then(() => {
      this.$rootScope.show_spinner = false;
      this.dismiss({ $value: 'cancel' });
      this.is_submitting = false;
    });
  }

  sendEmail() {
    this.ReservationStatus
      .sendMail(this.current_company_id, this.reservation, this.form_data).then(() => {
        this.$rootScope.show_spinner = false;
        this.dismiss({ $value: 'cancel' });
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
      this.changeStatus({ reservation: this.reservation, status: this.status }).then(() => {
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
