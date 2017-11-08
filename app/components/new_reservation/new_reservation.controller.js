import angular from 'angular';

export default class NewReservationCtrl {
  constructor(
    Customer, User, Reservation, Settings, TimeRange, CustomerCompany, Product, Zone, NewReservation,
    Table, moment, filterFilter, $state, $stateParams, $rootScope, $scope, $window, $auth, $timeout,
    $q, $mdDialog,
  ) {
    'ngInject';

    this.is_dashboard_page = $state.current.name === 'app.dashboard';
    this.is_reservations = $state.current.name === 'app.reservations';
    this.is_agenda = $state.current.name === 'app.agenda';
    this.is_customer_reservation = $state.current.name === 'customer_reservation.new';
    this.Reservation = Reservation;
    this.NewReservation = NewReservation;
    this.CustomerCompany = CustomerCompany;
    this.Customer = Customer;
    this.Product = Product;
    this.Zone = Zone;
    this.Table = Table;
    this.Settings = Settings;
    this.TimeRange = TimeRange;

    if (this.is_customer_reservation) {
      this.current_company_id = $stateParams.id;
      this.pagination = this.Reservation.pagination.customer;
    } else {
      this.current_company_id = User.getCompanyId();
      this.pagination = this.Reservation.pagination.backend;
    }

    this.$auth = $auth;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.filterFilter = filterFilter;
    this.$window = $window;
    this.$timeout = $timeout;
    this.$mdDialog = $mdDialog;

    this.moment = moment;
    this.selected_index = 0;
    this.errors = [];

    this.reservation = {
      language: 'NL',
      gender: 'Man',
      social: null,
      is_group: false,
      send_confirmation: true,
      reservation_parts: [],
    };

    this.time_ranges = [];

    this.reservation.reservation_parts.push(this.getNewReservationPart());
    this.current_part = this.reservation.reservation_parts[0];

    this.walk_in = Object.assign({}, this.reservation);
    this.walk_in_part = this.walk_in.reservation_parts[0];

    // states
    this.additional_is_opened = false;
    this.is_success = false;
    this.is_submitting = false;

    this.dateDisableDeferred = $q.defer();
    $scope.dateDisablePromise = this.dateDisableDeferred.promise;

    this.preloadData();
  }

  search(query) {
    if (!query) return [];
    // Fixing known bug https://github.com/angular/material/issues/3279
    if (this.temp_query === query) return [];
    this.temp_query = query;

    return this.Customer.search(this.current_company_id, query).then((result) => {
      return result.map((customer) => {
        return {
          value: customer.id,
          first_name: customer.first_name,
          last_name: customer.last_name,
          mail: customer.mail,
          primary_phone_number: customer.primary_phone_number,
          display: `${customer.first_name} ${customer.last_name}`,
        };
      });
    });
  }

  selectedItemChange(item) {
    if (item) {
      this.reservation.mail = item.mail;
      this.reservation.primary_phone_number = item.primary_phone_number;
      this.reservation.first_name = item.first_name;
      this.reservation.last_name = item.last_name;

      this.walk_in.mail = item.mail;
      this.walk_in.primary_phone_number = item.primary_phone_number;
      this.walk_in.first_name = item.first_name;
      this.walk_in.last_name = item.last_name;

      // trying to solve [object Object] bug: https://github.com/angular/material/issues/3760
      this.$timeout(() => {
        if (!item.last_name) {
          this.reservation.last_name = ' ';
          this.walk_in.last_name = ' ';
          item.last_name = ' ';
        }
      }, 100);
    }
  }

  refreshDatepicker() {
    this.dateDisableDeferred.notify(new Date().getTime());
  }

  disableDatesWithoutProducts(date, filterDatePicker) {
    if (filterDatePicker) {
      if (this.time_ranges[this.moment(date).isoWeekday()]) {
        return (Object.keys(this.time_ranges[this.moment(date).isoWeekday()]).length === 0);
      }
    }
  }

  walkInOrReservationPart() {
    return this.walk_in.reservation_parts.length
      ? this.walk_in.reservation_parts
      : this.reservation.reservation_parts;
  }

  triggerAdditionalInfo() {
    this.additional_is_opened = !this.additional_is_opened;
  }

  addPart() {
    const newPart = this.getNewReservationPart();
    newPart.date = new Date();
    this.reservation.reservation_parts.push(newPart);
  }

  removePart(e, index) {
    e.stopPropagation();
    if (this.reservation.reservation_parts.length > 1) {
      this.reservation.reservation_parts.splice(index, 1);
      this.current_part = this.reservation.reservation_parts[0];
    }
  }

  submitWalkInForm() {
    const dateTime = `${this.moment().format('DD-MM-YYYY HH:mm')}`;

    this.walk_in_part.date = this.moment().format('DD MMMM YYYY');
    this.walk_in_part.time = this.moment().format('HH:mm');

    this.validWalkInForm();
    if (this.errors.length) return false;

    this.is_submitting = true;
    const data = {
      language: this.walk_in.language,
      send_confirmation: this.walk_in.send_confirmation,
      notes: this.walk_in.notes,
      customer: {
        first_name: this.walk_in.first_name,
        last_name: this.walk_in.last_name,
        primary_phone_number: this.walk_in.primary_phone_number,
        mail: this.walk_in.mail,
      },
      reservation_parts: [],
    };

    this.walk_in.reservation_parts.forEach((part) => {
      data.reservation_parts.push({
        number_of_persons: part.number_of_persons,
        tables: part.tables,
        date_time: dateTime,
      });
    });

    this.Reservation.createWalkIn(this.current_company_id, data, this.is_customer_reservation)
      .then(
        () => {
          this.is_submitting = false;
          this.success = true;
          this.$rootScope.$broadcast('NewReservationCtrl.reload_reservations');
        },
        (error) => {
          this.is_submitting = false;
          this.errors = error;
        },
      );

    return true;
  }

  submitForm() {
    this.validForm();
    if (this.errors.length) return false;

    this.is_submitting = true;
    const dateOfBirth = this.reservation.date_of_birth ?
      this.moment(this.reservation.date_of_birth).format('DD-MM-YYYY') :
      undefined;

    const data = {
      language: this.reservation.language,
      send_confirmation: this.reservation.send_confirmation,
      notes: this.reservation.notes,
      is_group: this.reservation.is_group,
      company_name: this.reservation.company_name,
      reservation_pdf: this.reservation.pdfFile,
      customer: {
        last_name: this.reservation.last_name,
        first_name: this.reservation.first_name,
        primary_phone_number: this.reservation.primary_phone_number,
        mail: this.reservation.mail,
        secondary_phone_number: this.reservation.secondary_phone_number,
        street: this.reservation.street,
        house_number: this.reservation.house_number,
        zipcode: this.reservation.zipcode,
        city: this.reservation.city,
        date_of_birth: dateOfBirth,
        gender: this.reservation.gender,
        regular: 0,
      },
      reservation_parts: [],
    };

    this.reservation.reservation_parts.forEach((part) => {
      data.reservation_parts.push({
        number_of_persons: part.number_of_persons,
        product: part.product,
        tables: part.tables,
        date_time: `${this.moment(part.date).format('DD-MM-YYYY')} ${part.time}`,
      });
    });

    const socialAccount = JSON.parse(this.$window.localStorage.getItem('social_account'));
    if (this.reservation.social && socialAccount) {
      data.social_account = socialAccount;
      data.social_account.type = this.reservation.social;
    }

    this.$window.localStorage.removeItem('social_account');

    const params = [];
    params.push(this.is_customer_reservation ?
      { is_customer: true } :
      { confirm_mail: this.confirm_mail });

    this.Reservation.create(this.current_company_id, data, params, this.is_customer_reservation)
      .then(
        () => {
          this.is_submitting = false;
          this.success = true;
          this.$rootScope.$broadcast('NewReservationCtrl.reload_reservations');
        },
        (error) => {
          this.is_submitting = false;
          this.errors = error;
        },
      );

    return true;
  }

  openDatepicker() {
    this.opened = true;
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

  disabledTimes() {
    const result = [];

    this.openedTimeRangePeriod().forEach((item) => {
      if (this.timeIsDisabled(item)) {
        result.push(item);
      }
    });

    return result;
  }

  checkDeadline() {
    if (this.socials && this.socials.settings.reservation_deadline) {
      const now = this.moment();
      const selectedDate = this.moment(this.current_part.date).format('YYYY-MM-DD');
      const selectedDateTime = this.moment(now.format('HH:mm'), 'HH:mm');
      const deadline = this.moment(this.socials.settings.reservation_deadline, 'HH:mm');
      if (this.is_customer_reservation && selectedDate === now.format('YYYY-MM-DD')
        && selectedDateTime > deadline) {
        this.selected_index = 1;
        this.current_part.date = null;
        this.$mdDialog.show(this.$mdDialog.alert()
          .parent(angular.element(document.querySelector('.modal-dialog')))
          .clickOutsideToClose(true)
          .textContent('Vandaag nemen wij online geen reserveringen meer aan. Neem telefonisch contact met ons op')
          .ok('Terug'));
      }
    }
  }

  setZone(zone) {
    this.current_part.zones_is_showed = false;
    this.current_part.zone = zone;
  }

  loadTime() {
    this.current_part.time_is_loaded = false;
    this.current_part.available_time = [];

    if (this.canLoadTime()) {
      const companyId = this.current_company_id;
      const product = this.current_part.product;
      const reservationDate = this.moment(this.current_part.date).format('YYYY-MM-DD HH:mm:ss');

      this.Product.getAvailableTables(companyId, product, reservationDate, this.is_customer_reservation).then(
        (result) => {
          this.current_part.available_time = result;
          this.current_part.time_is_loaded = true;
        },
        () => {},
      );
    }
  }

  clearAndLoadTime() {
    this.current_part.time = null;
    this.loadTime();
  }

  loadProducts() {
    this.products_is_loaded = false;
    this.products = [];

    this.Product.getAll(this.current_company_id, false, this.is_customer_reservation).then(
      (result) => {
        this.products = result;
        this.products_is_loaded = true;

        if (this.products.length > 0) {
          this.loadTimeRanges();
        }
      },
      () => {});
  }

  loadZones() {
    this.zones_is_loaded = false;
    this.zones = [];

    this.Zone.getAll(this.current_company_id, this.is_customer_reservation).then(
      (result) => {
        this.zones = result;
        this.zones_is_loaded = true;
      },
      () => {},
    );
  }

  loadTables() {
    this.tables_is_loaded = false;
    this.tables = [];

    this.Table.getAll(this.current_company_id, this.is_customer_reservation).then(
      (result) => {
        this.tables = result;
        this.tables_is_loaded = true;
      },
      () => {},
    );
  }

  loadTimeRanges() {
    this.TimeRange.getAll(this.current_company_id, this.is_customer_reservation).then(
      (ranges) => {
        this.time_ranges = [];
        ranges.forEach((range) => {
          const rangeDayOfWeek = range.daysOfWeek[0];
          const rangeProduct = this.filterFilter(this.products, { id: range.productId })[0];

          if (!this.time_ranges[rangeDayOfWeek]) {
            this.time_ranges[rangeDayOfWeek] = {};
          }

          if (range.value && rangeProduct && !rangeProduct.hidden) {
            this.time_ranges[rangeDayOfWeek][range.productId] = {
              startTime: this.moment(range.startTime, 'HH:mm'),
              endTime: this.moment(range.endTime, 'HH:mm'),
            };
          }

          if (rangeDayOfWeek === this.moment().isoWeekday()) {
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
        this.refreshDatepicker();
      });
  }

  loadOccupiedTables() {
    this.current_part.occupied_tables = [];
    this.current_part.occupied_tables_is_loaded = false;
    const time = this.current_part.time;
    const dateTime = `${this.moment(this.current_part.date).format('DD-MM-YYYY')} ${time}`;

    this.Table
      .getOccupiedTables(this.current_company_id,
        { date_time: dateTime, part_id: null },
        this.is_customer_reservation).then(
        (result) => {
          this.current_part.occupied_tables = result;
          this.current_part.occupied_tables_is_loaded = true;
        },
        () => {},
      );
  }

  tablesDataIsLoaded() {
    return this.tables_is_loaded && this.current_part.occupied_tables_is_loaded;
  }

  loadSocialUrls() {
    this.CustomerCompany.getSocialUrls(this.current_company_id, this.is_customer_reservation)
      .then((socials) => {
        this.socials = socials;
        this.socials_is_loaded = true;
      });
  }

  selectTab(index) {
    this.selected_index = index;
    if (index === 2) {
      this.checkDeadline();
    }
  }

  canLoadTime() {
    return this.current_part.product &&
           this.current_part.number_of_persons &&
           this.current_part.date;
  }

  preloadData() {
    this.loadProducts();
    this.loadGeneralSettings();

    if (this.is_dashboard_page || this.is_reservations || this.is_agenda) {
      this.loadZones();
      this.loadTables();
    } else {
      this.loadSocialUrls();
    }
  }

  loadGeneralSettings() {
    this.Settings.getGeneralSettings(this.current_company_id, this.is_customer_reservation).then(
      (generalSettings) => {
        this.settings = generalSettings;
      });
  }

  authenticate(provider) {
    this.reservation.social = provider;

    if (provider === 'email') {
      this.selectTab(this.pagination.type);
    } else {
      this.$auth.authenticate(provider).then((response) => {
        this.$window.localStorage.setItem('social_account', JSON.stringify(response.data));
        this.reservation.first_name = response.data.name.split(' ')[0];
        this.reservation.last_name = response.data.name.split(' ')[1] || this.reservation.first_name;
        this.reservation.mail = response.data.email;
        this.reservation.date_of_birth = response.data.date_of_birth;
        this.reservation.primary_phone_number = response.data.primary_phone_number;
        if (response.data.gender) {
          this.reservation.gender = response.data.gender;
        }

        this.selectTab(this.pagination.type);
      }, () => {});
    }
  }

  changeDatePostProcess() {
    this.current_part.number_of_persons = null;
    this.current_part.product = null;
    this.current_part.time = null;
    this.selectTab(this.pagination.date);
  }

  changeNumberOfPersonsPostProcess() {
    this.changeNumberOfPersonsInputPostProcess();
    this.selectTab(this.pagination.number_of_persons);
  }

  changeNumberOfPersonsInputPostProcess() {
    this.current_part.product = null;
    this.clearAndLoadTime();
  }

  changeProductPostProcess() {
    this.current_part.current_product = null;

    if (this.current_part.product) {
      const product = this.current_part.product;
      this.current_part.current_product = this.filterFilter(this.products, { id: product })[0];
    }

    this.clearAndLoadTime();
    this.selectTab(this.pagination.product);
  }

  changeTimePostProcess() {
    this.selectTab(this.pagination.time);
    if (this.current_part.time && !this.is_customer_reservation) {
      this.loadOccupiedTables();
    }
  }

  changeTableValuesPostProcess() {
    const that = this;
    this.current_part.tables = [];

    angular.forEach(that.current_part.tables_values, (value, key) => {
      if (value) {
        that.current_part.tables.push(key);
      }
    });
  }

  changeIsGroupPostProcess() {
    this.reservation.reservation_parts = [this.current_part];
  }

  getNewReservationPart() {
    const innerId = this.reservation.reservation_parts.length + 1;

    return {
      inner_id: innerId,
      date: null,
      time: null,
      number_of_persons: null,
      product: null,
      tables: [],
      available_time: [],
      occupied_tables: [],
      zones_is_showed: true,
      zone: [],
    };
  }

  isPersonTab() {
    return this.selected_index === this.pagination.person - 1;
  }

  validForm() {
    this.errors = this.NewReservation
      .validForm(this.reservation, this.settings.phone_number_is_required);
  }

  validWalkInForm() {
    this.errors = this.NewReservation
      .validForm(this.walk_in, this.settings.phone_number_is_required, true);
  }

  numberOfPersonsMoreThanTableSeats() {
    return this.current_part.number_of_persons >
           this.Reservation.generalNumberOfPersons(this.tables, this.current_part.tables);
  }

  isEnoughSeats(timeObj) {
    return (this.current_part.number_of_persons <= timeObj.max_personen_voor_tafels &&
           this.current_part.number_of_persons <= timeObj.available_seat_count) ||
           timeObj.can_overbook;
  }

  openedTimeRangePeriod() {
    const availableTime = this.current_part.available_time;
    if (!availableTime.length) return [];

    const date = this.current_part.date;
    const openedTimes = this.filterFilter(availableTime, { is_open: true });

    if (openedTimes.length > 0) {
      const min = openedTimes[0].time;
      const max = openedTimes[openedTimes.length - 1].time;
      const now = this.moment();
      const formatedDate = this.moment(date).format('YYYY-MM-DD');

      return this.filterFilter(availableTime, item => item.time >= min &&
        item.time <= max &&
        this.moment(`${formatedDate} ${item.time}`) >= now &&
        (this.is_customer_reservation ? !item.more_than_deadline : true));
    }

    return [];
  }

  isDisabledTableByTableId(tableId) {
    const table = this.filterFilter(this.tables, { id: tableId })[0];
    let result = table ? table.hidden === true : false;

    if (!result && this.occupied_tables) {
      result = typeof this.occupied_tables[tableId] !== 'undefined';
    }

    if (!result) {
      result = false;
    }

    return result;
  }
}

