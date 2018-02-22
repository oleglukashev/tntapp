import angular from 'angular';

export default class EditReservationCtrl {
  constructor(User, ReservationPart, Reservation, Settings, TimeRange, Product, Zone,
    Table, moment, filterFilter, $rootScope, $window, $scope, $modalInstance, UserMenuEditFactroy,
    reservation, reservationPart, customer, customerNotes, customerPreferences, customerAllergies, Confirm,
    NewReservationGroupFactory) {
    'ngInject';

    this.current_company_id = User.getCompanyId();

    this.ReservationPart = ReservationPart;
    this.Reservation = Reservation;
    this.Product = Product;
    this.Zone = Zone;
    this.Table = Table;
    this.Settings = Settings;
    this.TimeRange = TimeRange;
    this.Confirm = Confirm;

    this.customer = customer;
    this.customerNotes = customerNotes;
    this.customerPreferences = customerPreferences;
    this.customerAllergies = customerAllergies;

    this.$window = $window;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.filterFilter = filterFilter;
    this.$modalInstance = $modalInstance;

    this.moment = moment;
    this.selected_index = 0;
    this.errors = [];

    this.reservation = reservation;
    this.available_time = [];

    this.products = [];

    // $modal cache input variables
    if (!this.reservation.is_cached) {
      this.reservation.is_cached = true;
      this.reservation.reservation_parts.forEach((part, index) => {
        this.reservation.reservation_parts[index] = this.getModifiedPart(part);
      });

      if (this.reservation.reservation_pdf) {
        this.reservation.reservation_pdf = {
          name: this.reservation.reservation_pdf,
        };
      }
    }

    // setup current part. we can't insert it to block above
    this.reservation.reservation_parts.forEach((part, index) => {
      if (reservationPart.id === part.id) {
        this.current_part = this.reservation.reservation_parts[index];
      }
    });

    Reservation.removePdf.bind(Reservation);

    this.loadGeneralSettings();
    UserMenuEditFactroy(this);
    NewReservationGroupFactory(this);

    this.$rootScope.show_spinner = true;
  }

  submitReservationForm() {
    const data = this.prepareFormData();
    this.is_submitting = true;
    this.$rootScope.show_spinner = true;
    this.Reservation.update(this.current_company_id, this.reservation.id, data)
      .then(
        (result) => {
          if (result.status === 200) {
            this.$modalInstance.dismiss('cancel');
            this.$rootScope.$broadcast('NewReservationCtrl.reload_reservations');
            this.$rootScope.$broadcast('UserMenuCtrl.load_full_data', { customerId: this.reservation.customer.id });
          } else if (result.status === -1 && result.statusText === '') {
            this.errors = ['Een bestand mag niet groter zijn dan 2MB'];
          }

          this.is_submitting = false;
          this.$rootScope.show_spinner = false;
        }, (error) => {
          this.is_submitting = false;
          this.$rootScope.show_spinner = false;
          this.errors = error.data.errors.errors;
        });

    return true;
  }

  prepareFormData() {
    const data = {
      notes: this.current_part.notes,
      is_group: this.reservation.is_group,
      reservation_parts: [],
    };

    if (this.pdfIsFile()) {
      data.reservation_pdf = this.reservation.reservation_pdf;
    }

    this.reservation.reservation_parts.forEach((part) => {
      const tableIds = angular.copy(part.table_ids);

      data.reservation_parts.push({
        number_of_persons: part.number_of_persons,
        product: part.product,
        tables: tableIds,
        date_time: `${this.moment(part.date).format('DD-MM-YYYY')} ${part.time}`,
      });
    });

    return data;
  }

  getModifiedPart(reservationPart) {
    return {
      id: reservationPart.id,
      table_ids: reservationPart.table_ids,
      old_table_ids: reservationPart.table_ids,
      duration_minutes: reservationPart.duration_minutes,
      old_duration_minutes: reservationPart.duration_minutes,
      date: this.moment(reservationPart.date_time).toDate(),
      old_date: this.moment(reservationPart.date_time).toDate(),
      number_of_persons: reservationPart.number_of_persons,
      old_number_of_persons: reservationPart.number_of_persons,
      product: reservationPart.product ? reservationPart.product.id : null,
      old_product: reservationPart.product ? reservationPart.product.id : null,
      time: this.moment(reservationPart.date_time).format('HH:mm'),
      old_time: this.moment(reservationPart.date_time).format('HH:mm'),
      notes: this.reservation.notes,
    };
  }

  // UNITE WITH NEW RESERVATION FUNCTION
  timeIsDisabled(timeObj) {
    if (!timeObj.is_open || !this.isEnoughSeats(timeObj)) {
      return true;
    }

    const product = this.current_part.current_product;
    if (product && this.current_part.number_of_persons) {
      if (product.max_person_count &&
          product.max_person_count < this.current_part.number_of_persons) {
        return true;
      }

      if (product.min_person_count &&
          product.min_person_count < this.current_part.number_of_persons) {
        return true;
      }
    } else {
      return true;
    }

    return false;
  }

  // UNITE WITH NEW RESERVATION FUNCTION
  isEnoughSeats(timeObj) {
    return (this.current_part.number_of_persons <= timeObj.max_personen_voor_tafels &&
           this.current_part.number_of_persons <= timeObj.available_seat_count) ||
           timeObj.can_overbook;
  }

  pdfIsFile() {
    return this.reservation.reservation_pdf &&
           this.reservation.reservation_pdf.constructor.name === 'File';
  }

  // UNITE WITH NEW RESERVATION FUNCTION
  disabledTimes() {
    const result = [];

    this.openedTimeRangePeriod().forEach((item) => {
      if (this.timeIsDisabled(item)) {
        result.push(item);
      }
    });

    return result;
  }

  loadPDF() {
    this.Reservation
      .getPDF(this.current_company_id, this.reservation.id)
      .then();
  }

  removePdf($event) {
    $event.stopPropagation();

    if (this.pdfIsFile()) {
      this.reservation.reservation_pdf = null;
    } else {
      this.Reservation.removePdf(this.current_company_id, this.reservation.id).then(() => {
        this.reservation.reservation_pdf = null;
      });
    }
  }

  loadGeneralSettings() {
    this.Settings.getGeneralSettings(this.current_company_id).then(
      (generalSettings) => {
        this.settings = generalSettings;
        this.loadOccupiedTables();
        this.loadTables();
        this.loadProducts();
        this.loadZones();
      });
  }

  loadProducts() {
    this.Product.getAll(this.current_company_id, false).then(
      (result) => {
        this.products = result;
        this.current_part.current_product =
          this.filterFilter(this.products, { id: this.current_part.product })[0];

        if (this.products.length > 0) {
          this.loadTimeRanges();
        }
      }, () => {});
  }

  loadZones() {
    this.zones = [];

    this.Zone.getAll(this.current_company_id).then(
      (result) => {
        this.zones = result;
        this.$rootScope.show_spinner = false;
      }, () => {
        this.$rootScope.show_spinner = false;
      });
  }

  loadTables() {
    this.tables = [];

    this.Table.getAll(this.current_company_id).then(
      (result) => {
        this.tables = result;
        this.loadTime();
      }, () => {});
  }

  loadTimeRanges() {
    this.TimeRange.getAllProductTimeRanges(this.current_company_id).then(
      (ranges) => {
        ranges.forEach((range) => {
          if (range.daysOfWeek[0] === this.moment().isoWeekday()) {
            const currentTime = this.moment();
            const startTime = this.moment(range.startTime, 'HH:mm');
            const endTime = this.moment(range.endTime, 'HH:mm');
            const productIsActive = currentTime.isBetween(startTime, endTime);

            this.products.forEach((product) => {
              if (product.id === range.productId) {
                product.hidden = !productIsActive;
              }
            });
          }
        });
      });
  }

  formIsValid() {
    return this.current_part.product &&
           this.current_part.number_of_persons &&
           this.current_part.date &&
           this.current_part.time;
  }

  canLoadTime() {
    return this.current_part.product &&
           this.current_part.number_of_persons &&
           this.current_part.date;
  }

  loadTime() {
    this.available_time = [];

    if (this.canLoadTime()) {
      const companyId = this.current_company_id;
      const product = this.current_part.product;
      const reservationDate = this.moment(this.current_part.date).format('YYYY-MM-DD HH:mm:ss');

      this.Product.getAvailableTables(companyId, product, reservationDate).then(
        (result) => {
          this.available_time = result;
          const date = this.moment(this.current_part.date).format('YYYY-MM-DD');
          const currentDateTime = this.moment(`${date} ${this.current_part.time}`);
          const durationMinutes = this.current_part.duration_minutes || this.settings.bezettings_minuten;
          this.available_time.forEach((itemObj) => {
            const itemObjDateTime = this.moment(`${date} ${itemObj.time}`);
            // 1000 - millisec
            // 60 - minutes
            // 15 parts by 15 minutes
            const absDiffOfMins = Math.abs(itemObjDateTime.diff(currentDateTime) / 1000 / 60);
            if (Math.round(durationMinutes / 15) >= (Math.abs(absDiffOfMins) / 15)) {
              this.current_part.table_ids.forEach((tableId) => {
                const count = this.Reservation.getPersonCountByTableId(this.tables, tableId);
                itemObj.available_seat_count += count;
                itemObj.max_personen_voor_tafels += count;
              });
              itemObj.available_table_count += this.current_part.table_ids.length;
            }
          });
        }, () => {});
    }
  }

  loadOccupiedTables() {
    this.occupied_tables = [];
    const dateForRequest = this.moment(this.current_part.date).format('DD-MM-YYYY');
    const dateTime = `${dateForRequest} ${this.current_part.time}`;

    this.Table
      .getOccupiedTables(this.current_company_id, { date_time: dateTime, part_id: null }).then(
        (result) => {
          this.occupied_tables = result;
          const date = this.moment(this.current_part.date).format('YYYY-MM-DD');
          const currentDateTime = this.moment(`${date} ${this.current_part.time}`);
          const durationMinutes = this.current_part.duration_minutes || this.settings.bezettings_minuten;
          const occupiedTablesClone = angular.copy(result);

          const oldDateTime = this.moment(`${date} ${this.current_part.old_time}`);
          // 1000 - millisec
          // 60 - minutes
          // 15 parts by 15 minutes
          const absDiffOfMins = Math.abs(oldDateTime.diff(currentDateTime) / 1000 / 60);
          const theSameDate = this.moment(this.current_part.date).format('YYYY-MM-DD') ===
            this.moment(this.current_part.old_date).format('YYYY-MM-DD');

          if (Math.round(durationMinutes / 15) >= (Math.abs(absDiffOfMins) / 15)) {
            Object.keys(occupiedTablesClone).forEach((key) => {
              if (theSameDate && this.current_part.old_table_ids.includes(parseInt(key))) {
                delete this.occupied_tables[key];
              }
            });
          }

          if (theSameDate && this.current_part.time === this.current_part.old_time) {
            this.current_part.table_ids = this.current_part.old_table_ids;
          }
        }, () => {});
  }

  openedTimeRangePeriod() {
    if (!this.available_time.length) return [];
    return this.available_time;
  }

  timeIsPast(timeObj) {
    const date = this.moment(this.current_part.date).format('YYYY-MM-DD');
    return this.moment(`${date} ${timeObj.time}`) < this.moment();
  }

  changeDatePostProcess() {
    this.loadTime();
    this.loadOccupiedTables();
  }

  changeTimePostProcess() {
    this.loadOccupiedTables();
  }

  changeNumberOfPersonsPostProcess() {
    this.loadTime();
  }

  changeIsGroupPostProcess() {
    this.reservation.reservation_parts = [this.current_part];
  }

  changeProductPostProcess() {
    if (this.current_part.product) {
      const product = this.current_part.product;
      this.current_part.current_product = this.filterFilter(this.products, { id: product })[0];
    }
    this.loadTime();
  }

  isDisabledTableByTableId(tableId) {
    const table = this.filterFilter(this.tables, { id: tableId })[0];
    let result = table ? table.hidden === true : false;

    if (!result && this.occupied_tables) {
      result = typeof this.occupied_tables[tableId] !== 'undefined';
    }

    if (!result &&
      this.current_part.table_ids &&
      this.current_part.table_ids.includes(tableId)) {
      result = false;
    }

    return result;
  }
}
