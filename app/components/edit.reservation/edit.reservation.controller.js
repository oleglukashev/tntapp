import angular from 'angular';

export default class EditReservationCtrl {
  constructor(User, ReservationPart, Reservation, Settings, TimeRange, Product, Zone, AppConstants,
    Table, moment, filterFilter, $rootScope, $window, $scope, Confirm, UserMenu,
    NewReservationGroupFactory, Notification, Availability, $q) {
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

    this.$window = $window;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.filterFilter = filterFilter;

    this.moment = moment;
    this.tabIndex = 0;
    this.errors = [];
    this.available_time = [];

    this.products = [];
    this.tables = {};
    this.zones = [];

    this.$onInit = () => {
      this.reservation = this.resolve.reservation;
      this.reservationPart = this.resolve.reservationPart;
      this.old_reservation_pdf = this.reservation.reservation_pdf;
      this.original_reservation_pdf_file = null;
      this.customer = angular.copy(this.UserMenu.customer);
      this.customerNotes = angular.copy(this.UserMenu.notes);
      this.customerPreferences = angular.copy(this.UserMenu.preferences);
      this.customerAllergies = angular.copy(this.UserMenu.allergies);

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

      this.$rootScope.show_spinner = true;
      $q.all([
        this.loadGeneralSettings(),
        this.loadProducts(this.reservation.type === 'direct'),
        this.loadZones(),
        this.loadHistory(this.reservation.id),
      ]).then((result) => {
        this.$rootScope.show_spinner = false;
        this.initGeneralSettings(result[0]);
        this.initProducts(result[1]);
        this.initZones(result[2]);
        this.initHistory(result[3]);

        $q.all([
          this.loadOccupiedTables(),
          this.loadTime(),
          this.loadTimeRanges(),
        ]).then((result) => {
          this.initOccupiedTables(result[0]);
          this.initTime(result[1]);
          this.initTimeRanges(result[2]);
        });
      });

      NewReservationGroupFactory(this);
    }
  }

  submitReservationForm() {
    const data = this.prepareFormData();
    this.is_submitting = true;
    this.$rootScope.show_spinner = true;
    this.Reservation.update(this.current_company_id, this.reservation.id, data)
      .then(
        (result) => {
          if (result.status === 200) {
            this.dismiss({$value: 'cancel'});
            this.$rootScope.$broadcast('NewReservationCtrl.reload_reservations');
            this.UserMenu.loadAndSetFullData(this.reservation.customer.id,
              this.reservationPart.id);
          } else if (result.status === 400) {
            this.errors = result.data.errors.errors;
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
      household_confirmation: this.reservation.household_confirmation,
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
        .getPDF(this.reservation.id)
        .then();
    }
  }

  removePdf($event) {
    $event.stopPropagation();
    this.reservation.reservation_pdf = null;
    this.original_reservation_pdf_file = null;
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

  openedTimeRangePeriod() {
    if (!this.available_time.length) return [];
    return this.available_time;
  }

  timeIsPast(timeObj) {
    const date = this.moment(this.current_part.date).format('YYYY-MM-DD');
    return this.moment(`${date} ${timeObj.time}`) < this.moment();
  }

  changeDatePostProcess() {
    if (this.canLoadTime()) {
      this.loadTime().then((times) => {
        this.initTime(times);
      });
    }

    this.loadOccupiedTables().then((tables) => {
      this.initOccupiedTables(tables);
    });
  }

  changeTimePostProcess() {
    this.loadOccupiedTables().then((tables) => {
      this.initOccupiedTables(tables);
    });
  }

  changeNumberOfPersonsPostProcess() {
    if (this.canLoadTime()) {
      this.loadTime().then((times) => {
        this.initTime(times);
      });
    }
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

    if (this.canLoadTime()) {
      this.loadTime().then((times) => {
        this.initTime(times);
      });
    }
  }

  isDisabledTableByTableId(tableId) {
    const table = this.tables[tableId];
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


  loadGeneralSettings() {
    return this.Settings.getGeneralSettings(this.current_company_id);
  }

  initGeneralSettings(generalSettings) {
    this.settings = generalSettings;
  }

  loadProducts(showHidden) {
    return this.Product.getAll(this.current_company_id, showHidden);
  }

  initProducts(products) {
    this.products = products;
    this.current_part.current_product =
      this.filterFilter(this.products, { id: this.current_part.product })[0];
  }

  loadZones() {
    return this.Zone.getAll(this.current_company_id);
  }

  initZones(zones) {
    this.zones = zones;
    this.talbles = {};
    this.zones.forEach((zone) => {
      zone.tables.forEach((table) => {
        if (!this.tables[table.id]) {
          this.tables[table.id] = table;
        }
      })
    });
  }

  loadHistory(reservationId) {
    return this.Reservation.getHistory(this.current_company_id, this.reservation.id);
  }

  initHistory(historyParts) {
    this.historyParts = historyParts;
    const formattedhistoryHash = [];
    let currentDateTime,
        currentDurationMinutes,
        currentNumberOfPersons,
        currentProduct,
        currentStatus,
        currentNotes,
        currentQuotation,
        currentSigned,
        currentLastContact,
        currentRemark,
        currentLeadType;
    this.historyParts.forEach((historyPart) => {
      if (historyPart.type === 'create') {
        formattedhistoryHash.push({
          date_time: {
            old: null,
            new: historyPart.date_time,
          },
          duration_minutes: {
            old: null,
            new: historyPart.duration_minutes,
          },
          number_of_persons: {
            old: null,
            new: historyPart.number_of_persons,
          },
          product: {
            old: null,
            new: historyPart.product,
          },
          status: {
            old: null,
            new: historyPart.status,
          },
          notes: {
            old: null,
            new: historyPart.notes,
          },
          quotation: {
            old: null,
            new: historyPart.quotation,
          },
          signed: {
            old: null,
            new: historyPart.signed,
          },
          lastContact: {
            old: null,
            new: historyPart.last_contact,
          },
          remark: {
            old: null,
            new: historyPart.remark,
          },
          lead_type: {
            old: null,
            new: historyPart.lead_type,
          },
          type: historyPart.type,
          user_id: historyPart.user_id,
          author_name: historyPart.author_name,
          created_on: historyPart.created_on,
        });
        currentDateTime = historyPart.date_time;
        currentDurationMinutes = historyPart.duration_minutes;
        currentNumberOfPersons = historyPart.number_of_persons;
        currentProduct = historyPart.product;
        currentStatus = historyPart.status;
        currentNotes = historyPart.notes;
        currentQuotation = historyPart.quotation;
        currentSigned = historyPart.signed;
        currentLastContact = historyPart.last_contact ? this.moment(historyPart.last_contact).format('YYYY-MM-DD') : null;
        currentRemark = historyPart.remark;
        currentLeadType = historyPart.lead_type;
      } else {
        const hash = {};
        if (historyPart.date_time) {
          hash.date_time = {
            old: currentDateTime,
            new: historyPart.date_time,
          }
          currentDateTime = historyPart.date_time;
        }
        if (historyPart.duration_minutes) {
          hash.duration_minutes = {
            old: currentDurationMinutes,
            new: historyPart.duration_minutes,
          }
          currentDurationMinutes = historyPart.duration_minutes;
        }
        if (historyPart.number_of_persons) {
          hash.number_of_persons = {
            old: currentNumberOfPersons,
            new: historyPart.number_of_persons,
          }
          currentNumberOfPersons = historyPart.number_of_persons;
        }
        if (historyPart.product) {
          hash.product = {
            old: currentProduct,
            new: historyPart.product,
          }
          currentProduct = historyPart.product;
        }
        if (historyPart.status) {
          hash.status = {
            old: currentStatus,
            new: historyPart.status,
          }
          currentStatus = historyPart.status;
        }
        if (historyPart.notes) {
          hash.notes = {
            old: currentNotes,
            new: historyPart.notes,
          }
          currentNotes = historyPart.notes;
        }
        if (historyPart.quotation != currentQuotation) {
          hash.quotation = {
            old: currentQuotation,
            new: historyPart.quotation,
          }
          currentQuotation = historyPart.quotation;
        }
        if (historyPart.signed != currentSigned) {
          hash.signed = {
            old: currentSigned,
            new: historyPart.signed,
          }
          currentSigned = historyPart.signed;
        }
        const formLastContact = historyPart.last_contact ? this.moment(historyPart.last_contact).format('YYYY-MM-DD') : null;
        if (formLastContact != currentLastContact) {
          hash.last_contact = {
            old: currentLastContact ? this.moment(currentLastContact).format('YYYY-MM-DD') : null,
            new: historyPart.last_contact ? this.moment(historyPart.last_contact).format('YYYY-MM-DD') : null,
          }
          currentLastContact = formLastContact;
        }
        if (historyPart.remark != currentRemark) {
          hash.remark = {
            old: currentRemark,
            new: historyPart.remark,
          }
          currentRemark = historyPart.remark;
        }
        if (historyPart.lead_type != currentLeadType) {
          hash.lead_type = {
            old: currentLeadType,
            new: historyPart.lead_type,
          }
          currentLeadType = historyPart.lead_type;
        }
        hash.type = historyPart.type;
        hash.user_id = historyPart.user_id;
        hash.author_name = historyPart.author_name;
        hash.created_on = historyPart.created_on;
        formattedhistoryHash.push(hash);
      }
    });
    this.historyParts = formattedhistoryHash;
  }

  loadTimeRanges() {
    return this.TimeRange.getAllProductTimeRanges(this.current_company_id);
  }

  initTimeRanges(timeRanges) {
    timeRanges.forEach((range) => {
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
  }

  loadTime() {
    const product = this.current_part.product;
    const reservationDate = this.moment(this.current_part.date).format('YYYY-MM-DD');
    const numberOfPersons = this.current_part.number_of_persons;
    return this.Availability.getAvailabilities(
      this.current_company_id,
      product,
      reservationDate,
      numberOfPersons
    );
  }

  initTime(times) {
    this.available_time = times;
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
          const table = this.tables[tableId];
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
  }

  loadOccupiedTables() {
    this.occupied_tables = [];
    const dateForRequest = this.moment(this.current_part.date).format('DD-MM-YYYY');
    const dateTime = `${dateForRequest} ${this.current_part.time}`;
    return this.Table.getOccupiedTables(this.current_company_id, { datetime: dateTime, part_id: null });
  }

  initOccupiedTables(tables) {
    this.occupied_tables = tables;
    const date = this.moment(this.current_part.date).format('YYYY-MM-DD');
    const currentDateTime = this.moment(`${date} ${this.current_part.time}`);
    const durationMinutes = this.current_part.duration_minutes || this.settings.bezettings_minuten;
    const occupiedTablesClone = angular.copy(tables);

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
  }

  setCurrentPart(part) {
    this.current_part = part;
  }
}
