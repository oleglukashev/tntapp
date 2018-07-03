import angular from 'angular';

export default class EditReservationCtrl {
  constructor(User, ReservationPart, Reservation, Settings, TimeRange, Product, Zone, AppConstants,
    Table, moment, filterFilter, $rootScope, $window, $scope, $modalInstance, UserMenuEditFactroy,
    reservation, reservationPart, Confirm, UserMenu, NewReservationGroupFactory, Notification,
    Availability, $state) {
    'ngInject';

    this.current_company_id = User.getCompanyId();

    this.ReservationPart = ReservationPart;
    this.Reservation = Reservation;
    this.Product = Product;
    this.Availability = Availability;
    this.Zone = Zone;
    this.Table = Table;
    this.Settings = Settings;
    this.TimeRange = TimeRange;
    this.Confirm = Confirm;
    this.UserMenu = UserMenu;
    this.Notification = Notification;
    this.AppConstants = AppConstants;

    this.customer = angular.copy(this.UserMenu.customer);
    this.customerNotes = angular.copy(this.UserMenu.notes);
    this.customerPreferences = angular.copy(this.UserMenu.preferences);
    this.customerAllergies = angular.copy(this.UserMenu.allergies);

    this.$window = $window;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.filterFilter = filterFilter;
    this.$modalInstance = $modalInstance;
    this.$state = $state;

    this.moment = moment;
    this.tab_index = 0;
    this.errors = [];

    this.reservation = reservation;
    this.reservationPart = reservationPart;
    this.old_reservation_pdf = this.reservation.reservation_pdf;
    this.original_reservation_pdf_file = null;
    this.available_time = [];

    this.products = [];

    // $modal cache input variables
    if (!this.reservation.is_cached) {
      this.reservation.is_cached = true;

      // get part collection from reservations with the same reservation
      if (this.UserMenu.reservations.length > 0) {
        this.reservation.reservation_parts = [];
        this.UserMenu.reservations.forEach((reservationItem) => {
          if (reservationItem.id === this.reservation.id) {
            reservationItem.reservation_parts.forEach((part) => {
              this.reservation.reservation_parts.push(this.getModifiedPart(part));
            });
          }
        });
      }
    }

    // setup current part. we can't insert it to block above
    this.reservation.reservation_parts.forEach((part, index) => {
      if (this.reservationPart.id === part.id) {
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
            this.UserMenu.loadAndSetFullData(this.current_company_id,
              this.reservation.customer.id,
              this.reservationPart.id);
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

    if (this.reservation.reservation_pdf) {
      if (this.original_reservation_pdf_file)
        data.reservation_pdf = this.reservation.reservation_pdf;
    } else if (this.old_reservation_pdf) {
      data.reservation_pdf = null;
    }

    if (this.reservation.is_group) {
      this.reservation.reservation_parts.forEach((part) => {
        const tableIds = angular.copy(part.table_ids);

        data.reservation_parts.push({
          number_of_persons: part.number_of_persons,
          product: part.product,
          tables: tableIds,
          date_time: `${this.moment(part.date).format('DD-MM-YYYY')} ${part.time}`,
        });
      });
    } else {
      const tableIds = angular.copy(this.current_part.table_ids);

      data.reservation_parts = [{
        number_of_persons: this.current_part.number_of_persons,
        product: this.current_part.product,
        tables: tableIds,
        date_time: `${this.moment(this.current_part.date).format('DD-MM-YYYY')} ${this.current_part.time}`,
      }];
    }

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
    return (timeObj.available_seats.includes(this.current_part.number_of_persons)) ||
      timeObj.can_overbook;
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

  uploadImage(file, errFiles) {
    if (file) {
      this.original_reservation_pdf_file = file;
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = (fileLoadedEvent) => {
        let srcData = fileLoadedEvent.target.result;
        srcData = srcData.replace(/data:application\/pdf;base64,/g, '');
        this.reservation.reservation_pdf = srcData;
      };
    }

    if (errFiles && errFiles[0]) {
      this.Notification.setText(`${errFiles[0].$error} ${errFiles[0].$errorParam}`);
    }
  };

  loadPDF() {
    if (this.original_reservation_pdf_file) {
      const link = window.document.createElement('a');
      link.setAttribute('href', encodeURI('data:application/pdf;base64,' + this.reservation.reservation_pdf));
      link.setAttribute('download', `reservation(#${this.reservation.id}).pdf`);
      link.click();
    } else {
      this.Reservation
        .getPDF(this.current_company_id, this.reservation.id)
        .then();
    }
  }

  removePdf($event) {
    $event.stopPropagation();
    this.reservation.reservation_pdf = null;
    this.original_reservation_pdf_file = null;
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
      const reservationDate = this.moment(this.current_part.date).format('YYYY-MM-DD');

      this.Availability.getAvailabilities(companyId, product, reservationDate, true).then(
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
                const table = this.filterFilter(this.tables, { id: tableId })[0];
                let startRange = this.settings.penalty != null
                  ? table.number_of_persons - this.settings.penalty
                  : 0;

                const length = table.number_of_persons - startRange;
                const range = Array.from({ length: length + 1 }, (v, k) => k + startRange);

                if (!itemObj.available_seats) {
                  itemObj.available_seats = range;
                } else {
                  range.forEach((seat) => {
                    if (!itemObj.available_seats.includes(seat)) {
                      itemObj.available_seats.push(seat);
                    }
                  });
                  itemObj.available_seats.sort();
                }
              });
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
      .getOccupiedTables(this.current_company_id, { datetime: dateTime, part_id: null }).then(
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

  getFormPartsList() {
    if (this.reservation.is_group) {
      return this.reservation.reservation_parts;
    }

    return [this.current_part];
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
