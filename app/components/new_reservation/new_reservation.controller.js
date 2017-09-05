import angular from 'angular';

export default class NewReservationCtrl {
  constructor(User, Reservation, ReservationLogic, Settings, TimeRange, CustomerCompany, Product,
    Zone, Table, moment, filterFilter, $state, $stateParams, $rootScope, $scope, $window, $auth) {
    'ngInject';

    this.is_dashboard_page = $state.current.name === 'app.dashboard';
    this.is_reservations = $state.current.name === 'app.reservations';
    this.is_agenda = $state.current.name === 'app.agenda';
    this.is_customer_reservation = $state.current.name === 'customer_reservation.new';

    this.Reservation = Reservation;
    this.ReservationLogic = ReservationLogic;
    this.CustomerCompany = CustomerCompany;
    this.Product = Product;
    this.Zone = Zone;
    this.Table = Table;
    this.Settings = Settings;
    this.TimeRange = TimeRange;

    if (this.is_customer_reservation) {
      this.current_company_id = $stateParams.id;
      this.pagination = this.ReservationLogic.pagination.customer;
    } else {
      this.current_company_id = User.getCompanyId();
      this.pagination = this.ReservationLogic.pagination.backend;
    }

    this.$auth = $auth;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.filterFilter = filterFilter;
    this.$window = $window;

    this.moment = moment;
    this.zones_is_showed = true;
    this.selected_index = 0;

    this.date_options = {
      formatYear: 'yy',
      startingDay: 1,
      showWeeks: false,
      class: 'datepicker',
    };

    this.init_date = new Date();
    this.max_date = moment().add(1, 'Y');
    this.format = 'dd-MM-yyyy';

    this.reservation = {
      date: null,
      number_of_persons: null,
      time: null,
      language: 'NL',
      gender: 'Man',
      social: null,
      is_group: false,
      send_confirmation: true,
    };

    // states
    this.additional_is_opened = false;
    this.is_success = false;

    $scope.$watchCollection('reserv.reservation.product', () => {
      this.current_product = null;

      if (this.reservation.product) {
        const product = this.reservation.product;
        this.current_product = this.filterFilter(this.products, { id: product })[0];
      }

      this.clearAndLoadTime();
    });

    $scope.$watchCollection('reserv.reservation.person_count', () => {
      this.clearAndLoadTime();
    });

    if (!this.is_customer_reservation) {
      $scope.$watchCollection('reserv.reservation.time', () => {
        if (this.reservation.time) {
          this.loadOccupiedTables();
        }
      });
    }

    $scope.$watchCollection('reserv.reservation.tables_values', () => {
      const that = this;
      this.reservation.tables = [];

      angular.forEach(that.reservation.tables_values, (value, key) => {
        if (value) {
          that.reservation.tables.push(key);
        }
      });
    });

    $scope.$watch('reserv.reservation.date', () => {
      this.reservation.person_count = null;
      this.reservation.time = null;
    });

    this.preloadData();
  }

  triggerAdditionalInfo() {
    this.additional_is_opened = !this.additional_is_opened;
  }

  submitForm() {
    this.is_submitting = true;
    const name = this.reservation.name || '';

    const data = {
      language: this.reservation.language,
      send_confirmation: this.reservation.send_confirmation,
      notes: this.reservation.notes,
      is_group: this.reservation.is_group,
      company_name: this.reservation.company_name,
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
        date_of_birth: this.moment(this.reservation.date_of_birth).format('DD-MM-YYYY'),
        gender: this.reservation.gender,
        regular: 0,
      },
      reservation_parts: [{
        datetime: `${this.reservationDateFormat('DD-MM-YYYY')} ${this.reservation.time}`,
        person_count: this.reservation.person_count,
        product: this.reservation.product,
        tables: this.reservation.tables,
      }],
      reservation_pdf: this.reservation.pdfFile,
    };

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
    return (this.reservation.date == null ||
            this.reservation.person_count == null ||
            this.reservation.time == null ||
            this.reservation.product == null);
  }

  openDatepicker() {
    this.opened = true;
  }

  timeIsDisabled(timeObj) {
    if (this.reservation.person_count > timeObj.max_personen_voor_tafels ||
        !timeObj.is_open ||
        timeObj.time_is_past ||
        (this.reservation.person_count > timeObj.available_seat_count && !timeObj.can_overbook)) {
      return true;
    }

    if (this.is_customer_reservation && timeObj.more_than_deadline) {
      return true;
    }

    if (this.current_product) {
      const reservationDateStr = this.reservationDateFormat('YYYY-MM-DD');
      const objTime = this.moment(`${reservationDateStr} ${timeObj.time}`);
      const startProductTime = this.moment(`${reservationDateStr} ${this.current_product.start_time}`);
      const endProductTime = this.moment(`${reservationDateStr} ${this.current_product.end_time}`);

      if (objTime <= endProductTime &&
          objTime >= startProductTime &&
          this.current_product.max_person_count &&
          ((this.current_product.max_person_count < this.reservation.person_count) ||
          this.current_product.min_person_count > this.reservation.person_count)) {
        return true;
      }
    }

    return false;
  }

  isMoreThanDeadline() {
    if (this.socials && this.socials.settings.reservation_deadline) {
      const now = this.moment();
      const deadline = this.moment(this.socials.settings.reservation_deadline);
      const reservationDateDeadline = this.moment(`${this.reservationDateFormat('YYYY-MM-DD')} ${deadline.format('HH:mm:ss')}`);
      return now > reservationDateDeadline;
    }

    return false;
  }

  reservationDateFormat(format) {
    return this.moment(this.reservation.date).format(format);
  }

  setZone(zone) {
    this.zones_is_showed = false;
    this.reservation.zone = zone;
  }

  loadTime() {
    this.time_is_loaded = false;
    this.available_time = [];

    if (this.canLoadTime()) {
      const companyId = this.current_company_id;
      const product = this.reservation.product;
      const reservationDate = this.moment(this.reservation.date).format('YYYY-MM-DD HH:mm:ss');

      this.Product
        .getAvailableTables(companyId, product, reservationDate).then(
          (result) => {
            this.available_time = result;
            this.time_is_loaded = true;
          },
          () => {
          });
    }
  }

  clearAndLoadTime() {
    this.reservation.time = null;
    this.loadTime();
  }

  loadProducts() {
    this.reservation.product = null;
    this.products_is_loaded = false;
    this.products = [];

    this.Product
      .getAll(this.current_company_id, false).then(
        (result) => {
          this.products = result;
          this.products_is_loaded = true;

          if (this.products.length > 0) {
            this.loadTimeRanges();
          }
        },
        () => {
        });
  }

  loadZones() {
    this.zones_is_loaded = false;
    this.reservation.tables_values = [];
    this.zones = [];

    this.Zone
      .getAll(this.current_company_id).then(
        (result) => {
          this.zones = result;
          this.zones_is_loaded = true;
        },
        () => {
        });
  }

  loadTables() {
    this.tables_is_loaded = false;
    this.tables = [];

    this.Table
      .getAll(this.current_company_id).then(
        (result) => {
          this.tables = result;
          this.tables_is_loaded = true;
        },
        () => {
        });
  }

  loadOccupiedTables() {
    this.occupied_tables = [];
    this.occupied_tables_is_loaded = false;
    const datetime = `${this.moment(this.reservation.date).format('DD-MM-YYYY')} ${this.reservation.time}`;

    this.Table
      .getOccupiedTables(this.current_company_id, { datetime: datetime, part_id: null }).then(
        (result) => {
          this.occupied_tables = result;
          this.occupied_tables_is_loaded = true;
        },
        () => {});
  }

  tablesDataIsLoaded() {
    return this.tables_is_loaded && this.occupied_tables_is_loaded;
  }

  loadSocialUrls() {
    this.CustomerCompany
      .getSocialUrls(this.current_company_id).then((socials) => {
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
    return this.reservation.product && this.reservation.person_count && this.reservation.date;
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

  loadTimeRanges() {
    this.TimeRange.getAll(this.current_company_id)
      .then(
        (ranges) => {
          ranges.forEach((range) => {
            if (range.daysOfWeek[0] === this.moment().isoWeekday()) {
              const currentTime = this.moment();
              const startTime = this.moment(range.startTime, 'HH:mm');
              const endTime = this.moment(range.endTime, 'HH:mm');
              const productIsActive = currentTime.isBetween(startTime, endTime);

              for (let i = 0; i < this.products.length; i += 1) {
                if (this.products[i].id === range.productId) {
                  this.products[i].hidden = !productIsActive;
                }
              }
            }
          });
        });
  }

  loadGeneralSettings() {
    this.Settings
      .getGeneralSettings(this.current_company_id).then(
        (generalSettings) => {
          this.settings = generalSettings;
        });
  }

  getReservationDateForSuccess() {
    return this.reservationDateFormat('DD MMMM YYYY');
  }

  authenticate(provider) {
    this.reservation.social = provider;

    if (provider === 'email') {
      this.selectTab(1);
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

        this.selectTab(1);
      }, () => {
        // nothing
      });
    }
  }
}
