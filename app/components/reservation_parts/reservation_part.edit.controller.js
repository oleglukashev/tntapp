export default class ReservationPartEditCtrl {
  constructor(User, ReservationPart, Reservation, Settings, TimeRange, Product, Zone,
    Table, moment, filterFilter, $rootScope, $window, $scope, $modalInstance, reservation,
    reservationPart) {
    'ngInject';

    this.current_company_id = User.getCompanyId();

    this.ReservationPart = ReservationPart;
    this.Reservation = Reservation;
    this.Product = Product;
    this.Zone = Zone;
    this.Table = Table;
    this.Settings = Settings;
    this.TimeRange = TimeRange;

    this.$window = $window;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.filterFilter = filterFilter;
    this.$modalInstance = $modalInstance;

    this.moment = moment;
    this.selected_index = 0;
    this.errors = [];

    this.pagination = this.Reservation.pagination.edit;
    this.reservation = reservation;

    this.current_part = {
      id: reservationPart.id,
      old_tables_values: {},
      tables_values: {},
      old_date: this.getPartDate(reservationPart),
      date: this.getPartDate(reservationPart),
      old_number_of_persons: parseInt(reservationPart.number_of_persons),
      number_of_persons: parseInt(reservationPart.number_of_persons),
      product: reservationPart.product.id,
      old_time: reservationPart.date_time ? this.moment(reservationPart.date_time).format('HH:mm') : null,
      time: reservationPart.date_time ? this.moment(reservationPart.date_time).format('HH:mm') : null,
      old_start_date_time: reservationPart.start_date_time ? this.moment(reservationPart.start_date_time).format('HH:mm') : null,
      start_date_time: reservationPart.start_date_time ? this.moment(reservationPart.start_date_time).format('HH:mm') : null,
      old_end_date_time: reservationPart.end_date_time ? this.moment(reservationPart.end_date_time).format('HH:mm') : null,
      end_date_time: reservationPart.end_date_time ? this.moment(reservationPart.end_date_time).format('HH:mm') : null,
      time_range: {},
      time_type: reservationPart.date_time ? 'single' : 'range',
      zones_is_showed: true,
    };

    this.current_part.time_range[this.current_part.start_date_time] = true;
    this.current_part.time_range[this.current_part.end_date_time] = true;

    reservationPart.table_ids.forEach((tableId) => {
      this.current_part.tables_values[tableId] = true;
      this.current_part.old_tables_values[tableId] = true;
    });

    this.preloadData();
    this.validForm();
  }

  submitForm() {
    this.is_submitting = true;
    this.current_part.tables = [];

    Object.keys(this.current_part.tables_values).forEach((key) => {
      if (this.current_part.tables_values[key]) {
        this.current_part.tables.push(key);
      }
    });

    const data = {
      number_of_persons: this.current_part.number_of_persons,
      product_id: this.current_part.product,
      tables: this.current_part.tables,
      part_id: this.current_part.id,
    };

    if (this.current_part.time_type === 'single') {
      this.current_part.date_time = `${this.moment(this.current_part.date).format('DD-MM-YYYY')} ${this.current_part.date.time}`;
    } else {
      this.current_part.start_date_time = `${this.moment(this.current_part.date).format('DD-MM-YYYY')} ${this.current_part.date.start_date_time}`;
      this.current_part.end_date_time = `${this.moment(this.current_part.date).format('DD-MM-YYYY')} ${this.current_part.date.end_date_time}`;
    }

    this.ReservationPart.update(this.current_company_id, this.current_part.id, data)
      .then(() => {
        this.is_submitting = false;
        this.$modalInstance.close();
        this.$rootScope.$broadcast('NewReservationCtrl.reload_reservations');
      },
      (error) => {
        this.is_submitting = false;
        this.errors = error;
      });
  }

  timeIsDisabled(timeObj) {
    let timeAvailableSeats = null;
    let maxPearsonsPerTable = null;

    timeAvailableSeats = timeObj.available_seat_count;
    maxPearsonsPerTable = timeObj.max_personen_voor_tafels;

    if ((this.current_part.old_time === timeObj.time ||
        this.current_part.old_start_date_time === timeObj.time ||
        this.current_part.old_end_date_time === timeObj.time) &&
        this.current_part.old_date === this.current_part.date) {

      const usedTables = this.filterFilter(this.tables, (item) => {
        return Object.keys(this.current_part.old_tables_values).includes(String(item.id));
      });

      const usedTablesPersonCount = usedTables.map(item => item.number_of_persons)
        .reduce((sum, valie) => parseInt(sum) + parseInt(valie), 0);

      timeAvailableSeats += usedTablesPersonCount;
      maxPearsonsPerTable += usedTablesPersonCount;
    }

    if (this.current_part.number_of_persons > maxPearsonsPerTable ||
        !timeObj.is_open ||
        timeObj.time_is_past ||
        (this.current_part.number_of_persons > timeAvailableSeats && !timeObj.can_overbook)) {
      return true;
    }

    if (this.current_product) {
      const reservationDateStr = this.moment(this.current_part.date).format('YYYY-MM-DD');
      const objTime = this.moment(`${reservationDateStr} ${timeObj.time}`);
      const startProductTime = this.moment(`${reservationDateStr} ${this.current_product.start_time}`);
      const endProductTime = this.moment(`${reservationDateStr} ${this.current_product.end_time}`);

      if (objTime <= endProductTime &&
          objTime >= startProductTime &&
          this.current_product.max_person_count &&
          ((this.current_product.max_person_count < this.current_part.number_of_persons) ||
          this.current_product.min_person_count > this.current_part.number_of_persons)) {
        return true;
      }
    }

    return false;
  }

  setZone(zone) {
    this.current_part.zones_is_showed = false;
    this.current_part.zone = zone;
  }

  preloadData() {
    this.loadProducts();
    this.loadGeneralSettings();
    this.loadZones();
    this.loadTables();
    this.loadTime();
    this.loadOccupiedTables();
  }

  loadTime() {
    this.current_part.time_is_loaded = false;
    this.current_part.available_time = [];

    const companyId = this.current_company_id;
    const product = this.current_part.product;
    const reservationDate = this.moment(this.current_part.date).format('YYYY-MM-DD HH:mm:ss');

    this.Product.getAvailableTables(companyId, product, reservationDate).then(
      (result) => {
        this.current_part.available_time = result;
        this.current_part.time_is_loaded = true;
      },
      () => {});
  }

  clearAndLoadTime() {
    this.current_part.time = null;
    this.clearCurrentPartTimeRange();
    this.loadTime();
  }

  loadProducts() {
    this.products_is_loaded = false;
    this.products = [];

    this.Product.getAll(this.current_company_id, false).then(
      (result) => {
        this.products = result;
        this.products_is_loaded = true;
        this.loadTimeRanges();
      },
      () => {});
  }

  loadZones() {
    this.zones_is_loaded = false;
    this.zones = [];

    this.Zone.getAll(this.current_company_id).then(
      (result) => {
        this.zones = result;
        this.zones_is_loaded = true;
      },
      () => {});
  }

  loadTables() {
    this.tables_is_loaded = false;
    this.tables = [];

    this.Table.getAll(this.current_company_id).then(
      (result) => {
        this.tables = result;
        this.tables_is_loaded = true;
      },
      () => {});
  }

  loadTimeRanges() {
    this.TimeRange.getAll(this.current_company_id)
      .then(
        (ranges) => {
          this.open_hours = {};
          ranges.forEach((range) => {
            if (range.daysOfWeek[0] === this.moment(this.current_part.date).isoWeekday()) {
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

  loadOccupiedTables() {
    this.current_part.occupied_tables = [];
    this.current_part.occupied_tables_is_loaded = false;
    let time = this.current_part.time;

    if (this.current_part.time_type === 'range') {
      time = this.current_part.start_date_time;
    }

    const dateTime = `${this.moment(this.current_part.date).format('DD-MM-YYYY')} ${time}`;

    this.Table
      .getOccupiedTables(this.current_company_id, { date_time: dateTime, part_id: null }).then(
        (result) => {
          this.current_part.occupied_tables = result;
          this.current_part.occupied_tables_is_loaded = true;
        },
        () => {});
  }

  tablesDataIsLoaded() {
    return this.tables_is_loaded && this.current_part.occupied_tables_is_loaded;
  }

  loadGeneralSettings() {
    this.Settings.getGeneralSettings(this.current_company_id).then(
      (generalSettings) => {
        this.settings = generalSettings;
      });
  }

  selectTab(index) {
    this.selected_index = index;
  }

  getPartDate(part) {
    const dateTime = part.date_time || part.start_date_time;
    return this.moment(dateTime).format('YYYY-MM-DD');
  }

  changeDatePostProcess() {
    this.current_part.number_of_persons = null;
    this.current_part.product = null;
    this.current_part.time = null;
    this.clearCurrentPartTimeRange();
    this.validForm();
    this.selectTab(this.pagination.date);
  }

  changeNumberOfPersonsPostProcess() {
    this.clearAndLoadTime();
    this.validForm();
    this.selectTab(this.pagination.number_of_persons);
  }

  changeProductPostProcess() {
    this.current_part.current_product = null;

    if (this.current_part.product) {
      const product = this.current_part.product;
      this.current_part.current_product = this.filterFilter(this.products, { id: product })[0];
    }

    this.clearAndLoadTime();
    this.validForm();
    this.selectTab(this.pagination.product);
  }

  clearCurrentPartTimeRange() {
    this.current_part.start_date_time = null;
    this.current_part.end_date_time = null;
    this.current_part.time_range = {};
  }

  validForm() {
    const errors = [];
    const generalDateTime = this.ReservationPart.generalDateTime(this.current_part);

    if (!this.current_part.date) errors.push('DATE not found');
    if (!this.current_part.number_of_persons) errors.push('NUMBER OF PERSONS not found');
    //if (!generalDateTime) errors.push('TIJDSTIP not found');
    if (!this.current_part.product) errors.push('PRODUCT not found');

    this.errors = errors;
  }
}
