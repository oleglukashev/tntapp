import angular from 'angular';

export default class ReservationPartEditCtrl {
  constructor(User, ReservationPart, Reservation, Settings, TimeRange, Product, Zone,
    Table, moment, filterFilter, $rootScope, $window, $scope, $modalInstance, UserMenuEditFactroy,
    reservation, customer, customerNotes, customerPreferences, customerAllergies, reservationPart,
    Confirm) {
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

    this.current_part = {
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
      notes: reservation.notes,
    };

    this.loadGeneralSettings();
    UserMenuEditFactroy(this);
  }

  submitPartForm() {
    this.is_submitting = true;

    const data = {
      number_of_persons: this.current_part.number_of_persons,
      product_id: this.current_part.product,
      tables: this.current_part.table_ids,
      part_id: this.current_part.id,
      date_time: `${this.moment(this.current_part.date).format('DD-MM-YYYY')} ${this.current_part.time}`,
      notes: this.current_part.notes,
    };

    this.ReservationPart.update(this.current_company_id, this.current_part.id, data)
      .then(
        (reservationPart) => {
          this.is_submitting = false;
          this.$rootScope.current_part = reservationPart;
          this.$rootScope.reservations.forEach((reservation, reservIndex) => {
            reservation.reservation_parts.forEach((part, partIndex) => {
              if (part.id === this.$rootScope.current_part.id) {
                this.$rootScope.reservations[reservIndex].reservation_parts[partIndex] =
                  this.$rootScope.current_part;
              }
            });
          });
          this.$modalInstance.close();
          this.$rootScope.$broadcast('NewReservationCtrl.reload_reservations');
        },
        (error) => {
          this.is_submitting = false;
          this.errors = error;
        },
      );
  }

  timeIsDisabled(timeObj) {
    if (!timeObj.is_open || !this.isEnoughSeats(timeObj)) {
      return true;
    }

    if (this.current_product) {
      const reservationDateStr = this.moment(this.reservation.date).format('YYYY-MM-DD');
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

  isEnoughSeats(timeObj) {
    return (this.current_part.number_of_persons <= timeObj.max_personen_voor_tafels &&
           this.current_part.number_of_persons <= timeObj.available_seat_count) ||
           timeObj.can_overbook;
  }

  disabledTimes() {
    const result = [];

    this.openedTimeRangePeriod().forEach((item) => {
      if (this.timeIsDisabled(item)) {
        result.push(item);
      }
    });

    return result;
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
    this.products = [];

    this.Product.getAll(this.current_company_id, false).then(
      (result) => {
        this.products = result;

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
      }, () => {});
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
    this.current_part.number_of_persons = null;
    this.current_part.product = null;
    this.current_part.time = null;
    this.current_part.table_ids = [];
  }

  changeTimePostProcess() {
    this.current_part.table_ids = [];
    this.loadOccupiedTables();
  }

  changeNumberOfPersonsPostProcess() {
    this.current_part.product = null;
    this.current_part.table_ids = [];
    this.clearAndLoadTime();
  }

  changeProductPostProcess() {
    this.current_part.table_ids = [];
    this.clearAndLoadTime();
  }

  clearAndLoadTime() {
    this.current_part.time = null;
    this.loadTime();
  }

  isDisabledTableByTableId(tableId) {
    const table = this.filterFilter(this.tables, { id: tableId })[0];
    let result = table ? table.hidden === true : false;

    if (!result && this.occupied_tables) {
      result = typeof this.occupied_tables[tableId] !== 'undefined';
    }

    if (!result && this.current_part.table_ids.includes(tableId)) {
      result = false;
    }

    return result;
  }
}
