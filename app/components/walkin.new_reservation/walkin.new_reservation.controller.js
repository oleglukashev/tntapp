export default class Controller {
  constructor(User, Reservation, Settings, ReservationPart, AppConstants, NewReservation, Zone,
    moment, $rootScope, $translate) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Reservation = Reservation;
    this.Zone = Zone;
    this.Settings = Settings;
    this.NewReservation = NewReservation;
    this.AppConstants = AppConstants;
    this.ReservationPart = ReservationPart;
    this.moment = moment;
    this.$rootScope = $rootScope;

    this.reservation = {
      language: $translate.proposedLanguage().toUpperCase() || 'NL',
      gender: 'Man',
      social: null,
      is_group: false,
      send_confirmation: true,
      reservation_parts: [],
      walk_in: true,
    };

    // translates
    $translate(['number_of_guests', 'notifications.is_required']).then((translates) => {
      this.number_of_guests_text = translates.number_of_guests;
      this.is_required_text = translates['notifications.is_required'];
    }, (translationIds) => {
      this.number_of_guests_text = translationIds.number_of_guests;
      this.is_required_text = translationIds['notifications.is_required'];
    });

    this.$onInit = () => {
      console.log(this);
      this.reservation.reservation_parts.push(this.ReservationPart.getNewReservationPart());
      this.current_part = this.reservation.reservation_parts[0];

      if (this.resolve) {
        this.current_part.date_time = this.moment(this.resolve.datetime).format('YYYY-MM-DD HH:mm:ss');
        this.current_part.tables = [this.resolve.tableId];
      }

      this.current_part.number_of_persons = 2;

      this.Settings.getGeneralSettings(this.current_company_id).then((settings) => {
        this.settings = settings;
      });

      this.Zone.getAll(this.current_company_id, true).then((zones) => {
        this.tables = [];
        this.zones = zones;
        this.zones.forEach((zone) => {
          zone.tables.forEach((table) => {
            this.tables.push(table);
          });
        });
      });
    };
  }

  submitForm(form) {
    this.validForm(form);
    if (this.errors.length) return false;

    const data = this.prepareFormData();

    this.is_submitting = true;
    this.$rootScope.show_spinner = true;
    this.Reservation.createWalkIn(this.current_company_id, data, false).then((result) => {
      if (result.status === 200) {
        this.response = result;
        this.is_success = true;
        this.$rootScope.$broadcast('NewReservationCtrl.reload_reservations');
      } else if (result.status === 400) {
        this.errors = result.data.errors.errors;
      } else if (result.status === -1 && result.statusText === '') {
        this.errors = [this.more_than_2mb_error_text];
      }

      this.is_submitting = false;
      this.$rootScope.show_spinner = false;
    },
    (error) => {
      this.$rootScope.show_spinner = false;
      this.is_submitting = false;
      this.errors = error.data.errors.errors;
    });

    return true;
  }

  prepareFormData() {
    const dateTime = `${this.moment().format('DD-MM-YYYY HH:mm')}`;

    this.current_part.date = this.moment().format('DD MMMM YYYY');
    this.current_part.time = this.moment().format('HH:mm');

    const data = {
      is_customer: this.is_customer_reservation,
      language: this.reservation.language,
      send_confirmation: this.reservation.send_confirmation,
      notes: this.reservation.notes,
      customer: {
        first_name: this.reservation.first_name,
        last_name: this.reservation.last_name,
        primary_phone_number: this.reservation.primary_phone_number,
        country: this.reservation.country,
        mail: this.reservation.mail,
      },
      reservation_parts: [],
    };

    if (data.customer.first_name === '') data.customer.first_name = null;
    if (data.customer.last_name === '') data.customer.last_name = null;

    this.reservation.reservation_parts.forEach((part) => {
      data.reservation_parts.push({
        number_of_persons: part.number_of_persons,
        tables: part.tables,
        date_time: dateTime,
      });
    });

    return data;
  }

  triggerAdditionalInfo() {
    this.additional_is_opened = !this.additional_is_opened;
  }

  showAutocompleteCustomerName() {
    return this.settings && this.settings.suggest_customer_name;
  }

  validForm(form) {
    this.errors = this.NewReservation.validForm(
      this.reservation,
      this.settings.phone_number_is_required,
      false,
      true,
      form);
  }
}
