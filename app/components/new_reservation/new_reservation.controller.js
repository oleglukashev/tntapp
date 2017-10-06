import angular from 'angular';

export default class NewReservationCtrl {
  constructor(User, Reservation, Settings, TimeRange, CustomerCompany, Product, Zone,
    Table, moment, filterFilter, $state, $stateParams, $rootScope, $scope, $window, $auth) {
    'ngInject';

    this.is_dashboard_page = $state.current.name === 'app.dashboard';
    this.is_reservations = $state.current.name === 'app.reservations';
    this.is_agenda = $state.current.name === 'app.agenda';
    this.is_customer_reservation = $state.current.name === 'customer_reservation.new';

    this.Reservation = Reservation;
    this.CustomerCompany = CustomerCompany;
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

    this.moment = moment;
    this.selected_index = 0;

    this.reservation = {
      language: 'NL',
      gender: 'Man',
      social: null,
      is_group: false,
      send_confirmation: true,
      reservation_parts: [],
    };

    this.reservation.reservation_parts.push(this.getNewReservationPart());
    this.current_part = this.reservation.reservation_parts[0];

    // states
    this.additional_is_opened = false;
    this.is_success = false;
    this.is_submitting = false;

    this.preloadData();
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

  submitForm() {
    this.is_submitting = true;
    const name = this.reservation.name || '';
    const parts = this.reservation.reservation_parts;
    const dateOfBirth = this.reservation.date_of_birth ? this.moment(this.reservation.date_of_birth).format('DD-MM-YYYY') : undefined;

    const data = {
      language: this.reservation.language,
      send_confirmation: this.reservation.send_confirmation,
      notes: this.reservation.notes,
      is_group: this.reservation.is_group,
      company_name: this.reservation.company_name,
      reservation_pdf: this.reservation.pdfFile,
      customer: {
        last_name: name.split(' ').splice(1).join(' '),
        first_name: name.split(' ')[0],
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

    if (!this.reservation.is_group && parts.length > 1) {
      this.reservation.reservation_parts = [this.current_part];
    }

    this.reservation.reservation_parts.forEach((part) => {
      const dataPart = {
        number_of_persons: part.number_of_persons,
        product: part.product,
        tables: part.tables,
      };

      if (part.time_type === 'single') {
        dataPart.date_time = `${this.moment(part.date).format('DD-MM-YYYY')} ${part.time}`;
      } else {
        dataPart.start_date_time = `${this.moment(part.date).format('DD-MM-YYYY')} ${part.start_date_time}`;
        dataPart.end_date_time = `${this.moment(part.date).format('DD-MM-YYYY')} ${part.end_date_time}`;
      }

      data.reservation_parts.push(dataPart);
    });

    const socialAccount = JSON.parse(this.$window.localStorage.getItem('social_account'));
    if (this.reservation.social && socialAccount) {
      data.social_account = socialAccount;
      data.social_account.type = this.reservation.social;
    }

    this.$window.localStorage.removeItem('social_account');

    const params = [];
    params.push(
      this.is_customer_reservation ?
        { is_customer: true } :
        { confirm_mail: this.confirm_mail },
    );

    this.Reservation.create(this.current_company_id, data, params)
      .then(() => {
        this.is_submitting = false;
        this.success = true;
        this.$rootScope.$broadcast('NewReservationCtrl.reload_reservations');
      },
      (error) => {
        this.is_submitting = false;
        this.errors = error;
      });
  }

  formIsValid() {
    let result = true;

    this.reservation.reservation_parts.forEach((part) => {
      if (!part.date ||
        !part.number_of_persons ||
        (!part.time && !part.start_date_time) ||
        !part.product ||
        !this.reservation.name ||
        !this.reservation.mail) {
        result = false;
      }
    });

    return result;
  }

  openDatepicker() {
    this.opened = true;
  }

  timeIsDisabled(timeObj) {
    if (this.current_part.number_of_persons > timeObj.max_personen_voor_tafels ||
        !timeObj.is_open ||
        timeObj.time_is_past ||
        (this.current_part.number_of_persons > timeObj.available_seat_count && !timeObj.can_overbook)) {
      return true;
    }

    if (this.is_customer_reservation && timeObj.more_than_deadline) {
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

  isMoreThanDeadline() {
    if (this.socials && this.socials.settings.reservation_deadline) {
      const now = this.moment();
      const deadline = this.moment(this.socials.settings.reservation_deadline);
      const str = `${this.moment(this.current_part.date).format('YYYY-MM-DD')} ${deadline.format('HH:mm:ss')}`;
      const reservationDateDeadline = this.moment(str);
      return now > reservationDateDeadline;
    }

    return false;
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

      this.Product.getAvailableTables(companyId, product, reservationDate).then(
        (result) => {
          this.current_part.available_time = result;
          this.current_part.time_is_loaded = true;
        },
        () => {});
    }
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

        if (this.products.length > 0) {
          this.loadTimeRanges();
        }
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
    this.TimeRange.getAll(this.current_company_id).then(
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

  loadSocialUrls() {
    this.CustomerCompany.getSocialUrls(this.current_company_id).then((socials) => {
      this.socials = socials;
      this.socials_is_loaded = true;
    });
  }

  selectTab(index) {
    if (index !== 2 || !this.isMoreThanDeadline()) {
      this.selected_index = index;
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
    this.Settings.getGeneralSettings(this.current_company_id).then(
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
        this.reservation.name = response.data.name;
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
    this.clearCurrentPartTimeRange();
    this.selectTab(this.pagination.date);
  }

  changeNumberOfPersonsPostProcess() {
    this.clearAndLoadTime();
    this.selectTab(this.pagination.number_of_persons);
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

  changeTimePostProcess(time) {
    if (this.current_part.time_type === 'single') {
      this.selectTab(this.pagination.time);
    } else {
      // 2 - start_time and end_time
      if (Object.keys(this.current_part.time_range).length > 2) {
        this.clearCurrentPartTimeRange();
        this.current_part.time_range[time] = true;
      }

      const keys = Object.keys(this.current_part.time_range).sort();
      if (keys.length) { this.current_part.start_date_time = keys[0]; }
      if (keys.length === 2) { this.current_part.end_date_time = keys[1]; }
    }

    if ((this.current_part.time || this.current_part.start_date_time) &&
      !this.is_customer_reservation) {
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

  getNewReservationPart() {
    const innerId = this.reservation.reservation_parts.length + 1;

    return {
      inner_id: innerId,
      date: null,
      time: null,
      start_date_time: null,
      end_date_time: null,
      time_range: {},
      time_type: 'single',
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

  clearCurrentPartTimeRange() {
    this.current_part.start_date_time = null;
    this.current_part.end_date_time = null;
    this.current_part.time_range = {};
  }
}

