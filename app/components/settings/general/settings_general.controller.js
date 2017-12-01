export default class SettingsGeneralCtrl {
  constructor(User, Settings, moment, $scope) {
    'ngInject';

    this.current_company_id = User.getCompanyId();

    this.$scope = $scope;
    this.Settings = Settings;
    this.moment = moment;
    this.is_loaded = false;

    this.form_data = {
      reservation_deadline_hours: 0,
      reservation_deadline_minutes: 0,
      request_type_start_hours: 0,
      request_type_start_minutes: 0,
      request_type_end_hours: 0,
      request_type_end_minutes: 0,
      enable_deadline: false,
      enable_request_type: false,
    };

    $scope.$watch('general_settings.form_data.reservation_deadline', () => {
      const reservationDeadLine = this.form_data.reservation_deadline;
      if (reservationDeadLine) {
        this.form_data.reservation_deadline_hours = 0;
        this.form_data.reservation_deadline_minutes = 0;
        this.form_data.enable_deadline = false;

        if (this.moment(reservationDeadLine, 'HH:mm').isValid()) {
          const time = reservationDeadLine.split(':');
          this.form_data.reservation_deadline_hours = parseInt(time[0], 10);
          this.form_data.reservation_deadline_minutes = parseInt(time[1], 10);
          this.form_data.enable_deadline = true;
        }
      }
    });

    $scope.$watch('general_settings.form_data.request_type_start', () => {
      const requestTypeStart = this.form_data.request_type_start;
      if (requestTypeStart) {
        this.form_data.request_type_start_hours = 0;
        this.form_data.request_type_start_minutes = 0;
        this.form_data.enable_request_type = false;

        if (this.moment(requestTypeStart, 'HH:mm').isValid()) {
          const time = requestTypeStart.split(':');
          this.form_data.request_type_start_hours = parseInt(time[0], 10);
          this.form_data.request_type_start_minutes = parseInt(time[1], 10);
          this.form_data.enable_request_type = true;
        }
      }
    });

    $scope.$watch('general_settings.form_data.request_type_end', () => {
      const requestTypeEnd = this.form_data.request_type_end;
      if (requestTypeEnd) {
        this.form_data.request_type_end_hours = 0;
        this.form_data.request_type_end_minutes = 0;
        this.form_data.enable_request_type = false;

        if (this.moment(requestTypeEnd, 'HH:mm').isValid()) {
          const time = requestTypeEnd.split(':');
          this.form_data.request_type_end_hours = parseInt(time[0], 10);
          this.form_data.request_type_end_minutes = parseInt(time[1], 10);
          this.form_data.enable_request_type = true;
        }
      }
    });

    $scope.$watch('general_settings.form_data.enable_deadline', (newValue, oldValue) => {
      if (newValue && !oldValue) {
        this.form_data.reservation_deadline_hours = 0;
        this.form_data.reservation_deadline_minutes = 0;
      }
    });

    $scope.$watch('general_settings.form_data.enable_request_type', (newValue, oldValue) => {
      if (newValue && !oldValue) {
        this.form_data.request_type_end_hours = 0;
        this.form_data.request_type_end_minutes = 0;
        this.form_data.request_type_start_hours = 0;
        this.form_data.request_type_start_minutes = 0;
      }
    });

    $scope.$watch('general_settings.form_data.request_type_end_minutes', () => {
      this.optimizeRequestTypeStartTimes();
    });

    $scope.$watch('general_settings.form_data.request_type_end_hours', () => {
      this.optimizeRequestTypeStartTimes();
    });

    $scope.$watch('general_settings.form_data.request_type_start_minutes', () => {
      this.optimizeRequestTypeEndTimes();
    });

    $scope.$watch('general_settings.form_data.request_type_start_hours', () => {
      this.optimizeRequestTypeEndTimes();
    });

    this.loadGeneralSettings();
  }

  loadGeneralSettings() {
    this.Settings
      .getGeneralSettings(this.current_company_id).then(
        (generalSettings) => {
          this.is_loaded = true;
          this.form_data = generalSettings;
        });
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
      booking_api: this.form_data.booking_api,
    };

    if (this.form_data.enable_deadline) {
      data.reservation_deadline = this.convertedReservationDeadlineToString();
    } else {
      data.reservation_deadline = null;
    }

    if (this.form_data.enable_request_type) {
      data.request_type_start = this.convertedRequestTypeStartToString();
      data.request_type_end = this.convertedRequestTypeEndToString()
    } else {
      data.request_type_start = null;
      data.request_type_end = null;
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
}
