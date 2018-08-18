export default class Controller {
  constructor(User, Settings, moment, $scope, $rootScope, $q) {
    'ngInject';

    this.current_company_id = User.getCompanyId();

    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.Settings = Settings;
    this.moment = moment;

    this.default_penalty = 10;

    this.form_data = {
      reservation_deadline_hours: null,
      reservation_deadline_minutes: null,
      request_type_start_hours: null,
      request_type_start_minutes: null,
      request_type_end_hours: null,
      request_type_end_minutes: null,
      enable_deadline: false,
      enable_penalty: false,
      enable_request_type: false,
    };

    this.is_loaded = false;
    $q.all([
      this.Settings.getGeneralSettings(this.current_company_id),
      this.Settings.getEmailsSettings(this.current_company_id),
    ]).then((result) => {
      this.is_loaded = true;
      this.initGeneralSettings(result[0]);
      this.initEmailSettings(result[1]);
    });
  }

  initGeneralSettings(generalSettings) {
    this.is_loaded = true;
    this.form_data = generalSettings;

    const reservationDeadLine = this.form_data.reservation_deadline;
    if (reservationDeadLine && this.moment(reservationDeadLine, 'HH:mm').isValid()) {
      const time = reservationDeadLine.split(':');
      this.form_data.reservation_deadline_hours = parseInt(time[0], 10);
      this.form_data.reservation_deadline_minutes = parseInt(time[1], 10);
      this.form_data.enable_deadline = true;
    }

    const requestTypeStart = this.form_data.request_type_start;
    const requestTypeEnd = this.form_data.request_type_end;
    if (requestTypeStart && requestTypeEnd) {
      if (this.moment(requestTypeStart, 'HH:mm').isValid()) {
        const timeStart = requestTypeStart.split(':');
        this.form_data.request_type_start_hours = parseInt(timeStart[0], 10);
        this.form_data.request_type_start_minutes = parseInt(timeStart[1], 10);
        this.form_data.enable_request_type = true;
      }

      if (this.moment(requestTypeEnd, 'HH:mm').isValid()) {
        const timeEnd = requestTypeEnd.split(':');
        this.form_data.request_type_end_hours = parseInt(timeEnd[0], 10);
        this.form_data.request_type_end_minutes = parseInt(timeEnd[1], 10);
        this.form_data.enable_request_type = true;
      }
    }

    if (this.form_data.penalty >= 0) {
      this.form_data.enable_penalty = true;
    }
  }

  initEmailSettings(emailSettings) {
    this.emails_settings = emailSettings;
  }

  submitForm() {
    const data = {
      bezettings_minuten: this.form_data.bezettings_minuten,
      limit_type: this.form_data.limit_type,
      auto_accept_reservation_person_limit: this.form_data.auto_accept_reservation_person_limit,
      phone_number_is_required: this.form_data.phone_number_is_required,
      quick_reservations_enabled: this.form_data.quick_reservations_enabled,
      auto_assign_tables_to_frontoffice_reservations: this.form_data.auto_assign_tables_to_frontoffice_reservations,
      show_timetable_first: this.form_data.show_timetable_first,
      show_customer_info_popup: this.form_data.show_customer_info_popup,
      allow_twitter_login: this.form_data.allow_twitter_login,
      allow_facebook_login: this.form_data.allow_facebook_login,
      enable_product_limits: this.form_data.enable_product_limits,
      send_mail_after_visit: this.form_data.send_mail_after_visit,
      suggest_customer_name: this.form_data.suggest_customer_name,
      booking_api: this.form_data.booking_api,
      assist_you_api: this.form_data.assist_you_api,
    };

    data.penalty = null;
    if (this.form_data.enable_penalty) {
      data.penalty = this.form_data.penalty;
    }

    if (this.form_data.penalty === null && this.form_data.enable_penalty) {
      this.form_data.enable_penalty = false;
    }

    data.reservation_deadline = null;
    if (this.form_data.enable_deadline) {
      data.reservation_deadline = this.convertedReservationDeadlineToString();
    }

    data.request_type_start = null;
    data.request_type_end = null;
    if (this.form_data.enable_request_type) {
      data.request_type_start = this.convertedRequestTypeStartToString();
      data.request_type_end = this.convertedRequestTypeEndToString();
    }

    this.Settings.updateGeneralSettings(this.current_company_id, data);
  }

  getFullMinutesOrHoursByNumber(number) {
    if (parseInt(number) !== number) {
      return '00';
    }

    let result = String(number);

    if (result.length === 1) {
      result = `0${result}`;
    }

    return result;
  }

  getMinutesArray() {
    return [...Array(60).keys()];
  }

  getHoursArray() {
    return [...Array(24).keys()];
  }

  convertedReservationDeadlineToString() {
    let result = this.getFullMinutesOrHoursByNumber(this.form_data.reservation_deadline_hours);
    result += ':';
    result += this.getFullMinutesOrHoursByNumber(this.form_data.reservation_deadline_minutes);
    return result;
  }

  convertedRequestTypeStartToString() {
    let result = this.getFullMinutesOrHoursByNumber(this.form_data.request_type_start_hours);
    result += ':';
    result += this.getFullMinutesOrHoursByNumber(this.form_data.request_type_start_minutes);
    return result;
  }

  convertedRequestTypeEndToString() {
    let result = this.getFullMinutesOrHoursByNumber(this.form_data.request_type_end_hours);
    result += ':';
    result += this.getFullMinutesOrHoursByNumber(this.form_data.request_type_end_minutes);
    return result;
  }

  checkRequestTypeStartAndSubmitForm() {
    this.optimizeRequestTypeStartTimes();
    this.submitForm();
  }

  checkRequestTypeEndAndSubmitForm() {
    this.optimizeRequestTypeEndTimes();
    this.submitForm();
  }

  optimizeRequestTypeStartTimes() {
    if (this.convertedRequestTypeStartToString() >
        this.convertedRequestTypeEndToString()) {
      this.form_data.request_type_start_hours = this.form_data.request_type_end_hours;
      this.form_data.request_type_start_minutes = this.form_data.request_type_end_minutes;
    }
  }

  optimizeRequestTypeEndTimes() {
    if (this.convertedRequestTypeEndToString() <
        this.convertedRequestTypeStartToString()) {
      this.form_data.request_type_end_hours = this.form_data.request_type_start_hours;
      this.form_data.request_type_end_minutes = this.form_data.request_type_start_minutes;
    }
  }

  updateDeadlineAndSubmitForm() {
    this.form_data.reservation_deadline_hours = null;
    this.form_data.reservation_deadline_minutes = null;

    if (this.form_data.enable_deadline) {
      this.form_data.reservation_deadline_hours = 0;
      this.form_data.reservation_deadline_minutes = 0;
    }

    this.submitForm();
  }

  updateRequestTypePeriod() {
    this.form_data.request_type_start_hours = null;
    this.form_data.request_type_start_minutes = null;
    this.form_data.request_type_end_hours = null;
    this.form_data.request_type_end_minutes = null;

    if (this.form_data.enable_request_type) {
      this.form_data.request_type_start_hours = 0;
      this.form_data.request_type_start_minutes = 0;
      this.form_data.request_type_end_hours = 0;
      this.form_data.request_type_end_minutes = 0;
    }

    this.submitForm();
  }

  updatePenaltyAndSubmitForm() {
    this.form_data.penalty = null;

    if (this.form_data.enable_penalty) {
      this.form_data.penalty = this.default_penalty;
    }

    this.submitForm();
  }
}
