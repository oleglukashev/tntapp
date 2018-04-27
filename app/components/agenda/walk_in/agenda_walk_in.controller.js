export default class AgendaWalkInCtrl {
  constructor(User, Zone, Table, Reservation, ReservationPart, tableId, tableNumber, datetime,
    moment, $window, $modalInstance, $rootScope, $translate, Confirm) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.datetime = datetime;
    this.Confirm = Confirm;
    this.Zone = Zone;
    this.Table = Table;
    this.Reservation = Reservation;
    this.ReservationPart = ReservationPart;
    this.$window = $window;
    this.$rootScope = $rootScope;
    this.$modalInstance = $modalInstance;
    this.moment = moment;
    this.errors = [];
    this.additional_is_opened = false;

    this.reservation = {
      language: $translate.proposedLanguage().toUpperCase() || 'NL',
      gender: 'Man',
      social: null,
      is_group: false,
      send_confirmation: true,
      reservation_parts: [],
    };

    this.current_part = this.ReservationPart.getNewReservationPart();
    this.current_part.date_time = this.moment(datetime).format('YYYY-MM-DD HH:mm:ss');
    this.current_part.number_of_persons = 2;
    this.current_part.tables = [tableId];
    this.reservation.reservation_parts.push(this.current_part);
    this.loadZones();

    // translates
    $translate(['number_of_guests', 'notifications.is_required']).then((translates) => {
      this.number_of_guests_text = translates.number_of_guests;
      this.is_required_text = translates['notifications.is_required'];
    }, (translationIds) => {
      this.number_of_guests_text = translationIds.number_of_guests;
      this.is_required_text = translationIds['notifications.is_required'];
    });
  }

  validForm() {
    const errors = [];

    if (!this.current_part.number_of_persons) {
      errors.push(`${this.number_of_guests_text} ${this.is_required_text}`);
    }

    return errors;
  }

  submitForm() {
    this.validForm();
    if (this.errors.length) return false;
    const data = this.prepareFormData();

    this.is_submitting = true;
    this.$rootScope.show_spinner = true;
    this.Reservation.createWalkIn(this.current_company_id, data, this.is_customer_reservation)
      .then(
        () => {
          this.$rootScope.show_spinner = false;
          this.is_submitting = false;
          this.$rootScope.$broadcast('NewReservationCtrl.reload_reservations');
          this.$modalInstance.dismiss('cancel');
        },
        (error) => {
          this.$rootScope.show_spinner = false;
          this.is_submitting = false;
          this.errors = error;
        });

    return true;
  }

  prepareFormData() {
    const data = {
      language: this.reservation.language,
      send_confirmation: this.reservation.send_confirmation,
      notes: this.reservation.notes,
      customer: {
        first_name: this.reservation.first_name,
        last_name: this.reservation.last_name,
        primary_phone_number: this.reservation.primary_phone_number,
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
        date_time: part.date_time,
      });
    });

    return data;
  }

  triggerAdditionalInfo() {
    this.additional_is_opened = !this.additional_is_opened;
  }

  loadZones() {
    this.zones = [];

    this.Zone.getAll(this.current_company_id, this.is_customer_reservation).then(
      (result) => {
        this.zones = result;
        this.loadTables();
      }, () => {});
  }

  loadTables() {
    this.tables = [];

    this.Table.getAll(this.current_company_id, this.is_customer_reservation).then(
      (result) => {
        this.tables = result;
      }, () => {});
  }
}
