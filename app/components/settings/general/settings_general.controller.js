import angular from 'angular';

export default class SettingsGeneralCtrl {
  constructor(User, Settings, moment, $scope) {
    'ngInject';

    this.current_company = User.current_company;

    this.$scope 	 = $scope;
    this.Settings  = Settings;
    this.moment 	 = moment;
    this.is_loaded = false;

    this.form_data = {
    	reservation_deadline_hours: 0,
    	reservation_deadline_minutes: 0
    }

    $scope.$watch('general_settings.form_data.reservation_deadline', () => {
    	let reservation_deadline = this.moment(this.form_data.reservation_deadline);

    	if (reservation_deadline.isValid()) {
      	this.form_data.reservation_deadline_hours 	= parseInt(this.moment(this.form_data.reservation_deadline).format('H'));
      	this.form_data.reservation_deadline_minutes = parseInt(this.moment(this.form_data.reservation_deadline).format('m'));
      } else {
      	this.form_data.reservation_deadline_hours 	= 0
      	this.form_data.reservation_deadline_minutes = 0;
      }
    });

    this.loadGeneralSettings();
  }

  loadGeneralSettings() {
  	this.Settings
  		.getGeneralSettings(this.current_company.id)
  			.then(
          (general_settings) => {
            this.is_loaded = true;
            this.form_data = general_settings;

  				});
	}

	submitForm() {
		let data = {
			bezettings_minuten: this.form_data.bezettings_minuten,
			limit_type: this.form_data.limit_type,
			auto_accept_reservation_persion_limit: this.form_data.auto_accept_reservation_persion_limit,
			phone_number_is_required: this.form_data.phone_number_is_required,
			quick_reservations_enabled: this.form_data.quick_reservations_enabled,
			auto_assign_tables_to_frontoffice_reservations: this.form_data.auto_assign_tables_to_frontoffice_reservations,
			show_timetable_first: this.form_data.show_timetable_first,
			show_customer_info_popup: this.form_data.show_customer_info_popup,
			allow_twitter_login: this.form_data.allow_twitter_login,
			allow_facebook_login: this.form_data.allow_facebook_login,
			enable_product_limits: this.form_data.enable_product_limits,
			send_mail_after_visit: this.form_data.send_mail_after_visit
		}

		data.reservation_deadline = this.getFullMinutesOrHoursByNumber(this.form_data.reservation_deadline_hours);
		data.reservation_deadline += ':';
		data.reservation_deadline += this.getFullMinutesOrHoursByNumber(this.form_data.reservation_deadline_minutes);


		this.Settings
			.updateGeneralSettings(this.current_company.id, data)
	      .then((general_settings) => {
	        
	      });
	}

	getFullMinutesOrHoursByNumber(number) {
		if (parseInt(number) !== number) {
			return '00';
		}

		let result = String(number);

		if (result.length == 1) {
			result = '0' + result;
		}

		return result;
	}

	getMinutesArray() {
		return [...Array(60).keys()];
	}

	getHoursArray() {
		return [...Array(24).keys()];
	}
}