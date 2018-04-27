export default class NewReservationCtrl {
  constructor(Customer, User, Reservation, Settings, TimeRange, CustomerCompany, Product, Zone,
    NewReservation, Table, AppConstants, NewReservationDateFactory, NewReservationGroupFactory,
    NewReservationNumberOfPersonsFactory, NewReservationPersonFactory, NewReservationTimeFactory,
    NewReservationProductFactory, NewReservationTypeFactory, NewReservationZoneFactory,
    NewReservationPersonAutocompleteFactory, ReservationPart, moment, filterFilter, $state,
    $stateParams, $scope, $rootScope, $window, $translate) {
    'ngInject';

    this.is_dashboard_page = $state.current.name === 'app.dashboard';
    this.is_reservations = $state.current.name === 'app.reservations';
    this.is_agenda = $state.current.name === 'app.agenda';
    this.is_customer_reservation = $state.current.name === 'customer_reservation.new';
    this.Reservation = Reservation;
    this.ReservationPart = ReservationPart;
    this.NewReservation = NewReservation;
    this.CustomerCompany = CustomerCompany;
    this.Customer = Customer;
    this.Product = Product;
    this.Zone = Zone;
    this.Table = Table;
    this.Settings = Settings;
    this.TimeRange = TimeRange;
    this.AppConstants = AppConstants;
    this.moment = moment;
    this.filterFilter = filterFilter;
    this.$rootScope = $rootScope;
    this.$window = $window;
    this.$translate = $translate;

    if (this.is_customer_reservation) {
      this.current_company_id = $stateParams.id;
      this.pagination = this.Reservation.pagination.customer;
    } else {
      this.current_company_id = User.getCompanyId();
      this.pagination = this.Reservation.pagination.backend;
      Reservation.max_date = undefined;
    }

    this.tab_index = 0;
    this.errors = [];

    this.product_week_time_ranges = {};
    this.product_time_ranges = {};
    this.zone_time_ranges = {};
    this.open_time_ranges = {};
    this.warnings = {};

    this.reservation = {
      language: $translate.proposedLanguage().toUpperCase() || 'NL',
      gender: 'Man',
      social: null,
      is_group: false,
      send_confirmation: true,
      reservation_parts: [],
    };

    this.reservation.reservation_parts.push(this.ReservationPart.getNewReservationPart());
    this.current_part = this.reservation.reservation_parts[0];

    if ($stateParams.date) {
      const date = this.moment($stateParams.date, 'DD-MM-YYYY').toDate();

      if (date !== 'Invalid Date') {
        this.current_part.date = date;
      }
    }

    if ($stateParams.aantal_personen) {
      this.current_part.number_of_persons = parseInt($stateParams.aantal_personen);
    }

    this.is_success = false;
    this.is_submitting = false;

    NewReservationDateFactory(this, $scope);
    NewReservationGroupFactory(this);
    NewReservationNumberOfPersonsFactory(this);
    NewReservationPersonFactory(this);
    NewReservationTimeFactory(this);
    NewReservationProductFactory(this);
    NewReservationTypeFactory(this);
    NewReservationZoneFactory(this);
    NewReservationPersonAutocompleteFactory(this);
    this.preloadData();

    // run translates
    this.more_than_2mb_error_text = '';
    $translate('notifications.more_than_2mb').then((total) => {
      this.more_than_2mb_error_text = total;
    }, (translationIds) => {
      this.more_than_2mb_error_text = translationIds;
    });
  }

  submitForm() {
    this.validForm();
    if (this.errors.length) return false;

    let data;
    let method;
    if (this.reservation.walk_in) {
      data = this.prepareWalkInFormData();
      method = this.Reservation.createWalkIn.bind(this.Reservation);
    } else {
      data = this.prepareFormData();
      method = this.Reservation.create.bind(this.Reservation);
    }

    this.is_submitting = true;
    this.$rootScope.show_spinner = true;
    method(this.current_company_id, data, this.is_customer_reservation)
      .then(
        (result) => {
          if (result.status === 200) {
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

  prepareWalkInFormData() {
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

  prepareFormData() {
    const dateOfBirth = this.reservation.date_of_birth ?
      this.moment(this.reservation.date_of_birth).format('DD-MM-YYYY') :
      undefined;

    const data = {
      is_customer: this.is_customer_reservation,
      language: this.reservation.language,
      send_confirmation: this.reservation.send_confirmation,
      notes: this.reservation.notes,
      is_group: this.reservation.is_group,
      company_name: this.reservation.company_name,
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

    if (data.customer.first_name === '') data.customer.first_name = null;
    if (data.customer.last_name === '') data.customer.last_name = null;
    if (this.reservation.reservation_pdf) data.reservation_pdf = this.reservation.reservation_pdf;

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
      data.social_account = {
        type: this.reservation.social,
        id: socialAccount.id,
        name: socialAccount.name,
      };

      if (data.social_account.type === 'facebook') {
        data.social_account.url = socialAccount.link;
      } else if (data.social_account.type === 'twitter') {
        data.social_account.url = `${this.AppConstants.twitterUrl}/${socialAccount.screen_name}`;
        data.social_account.profile_image_url = socialAccount.profile_image_url;
      }
    }

    this.$window.localStorage.removeItem('social_account');

    return data;
  }

  loadTime() {
    this.current_part.time_is_loaded = false;
    this.current_part.available_time = [];

    if (this.canLoadTime()) {
      const companyId = this.current_company_id;
      const product = this.current_part.product;
      const reservationDate = this.moment(this.current_part.date).format('YYYY-MM-DD');
      this.$rootScope.show_spinner = true;

      this
        .Product
        .getAvailableTables(companyId, product, reservationDate, true)
        .then((result) => {
          this.$rootScope.show_spinner = false;
          this.current_part.available_time = result;
          this.current_part.time_is_loaded = true;
        }, () => {
          this.$rootScope.show_spinner = false;
        });
    }
  }

  clearAndLoadTime() {
    this.current_part.time = null;
    this.loadTime();
  }

  loadProducts() {
    this.products_is_loaded = false;
    this.products = [];

    this.Product.getAll(this.current_company_id, false, this.is_customer_reservation)
      .then(
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
      }, () => {});
  }

  loadTables() {
    this.tables_is_loaded = false;
    this.tables = [];

    this.Table.getAll(this.current_company_id, this.is_customer_reservation).then(
      (result) => {
        this.tables = result;
        this.tables_is_loaded = true;
      }, () => {});
  }

  loadTimeRanges() {
    // TODO REFACTOR AFTER NEW RESERVATION REFACTORING
    this.TimeRange.getAll(this.current_company_id, null, this.is_customer_reservation).then(
      (ranges) => {
        const productWeekTimeRanges = ranges
          .filter(item => item.type === 'product' && item.days_of_week.length);

        productWeekTimeRanges.forEach((timeRange) => {
          timeRange.days_of_week.forEach((day) => {
            if (!this.product_week_time_ranges[day]) {
              this.product_week_time_ranges[day] = {};
            }
            this.product_week_time_ranges[day][timeRange.product.id] = timeRange;
          });
        });

        const zoneTimeRanges = ranges.filter(item => item.type === 'zone');
        if (zoneTimeRanges) {
          zoneTimeRanges.forEach((timeRange) => {
            if (!this.zone_time_ranges[timeRange.fixed_date]) {
              this.zone_time_ranges[timeRange.fixed_date] = {};
            }
            this.zone_time_ranges[timeRange.fixed_date][timeRange.zone.id] = timeRange;
          });
        }

        const productTimeRanges = ranges.filter(item =>
          (item.type === 'product' || item.type === 'multiproduct') && !item.days_of_week.length);
        if (productTimeRanges.length) {
          productTimeRanges.forEach((timeRange) => {
            if (!this.product_time_ranges[timeRange.fixed_date]) {
              this.product_time_ranges[timeRange.fixed_date] = {};
            }

            if (timeRange.type === 'product') {
              this.product_time_ranges[timeRange.fixed_date][timeRange.product.id] = timeRange;
            } else if (timeRange.type === 'multiproduct') {
              timeRange.products.forEach((productId) => {
                this.product_time_ranges[timeRange.fixed_date][productId] = timeRange;
              });
            }
          });
        }

        const openTimeRanges = ranges.filter(item => item.type === 'open' && !item.days_of_week.length);
        if (openTimeRanges.length) {
          openTimeRanges.forEach((timeRange) => {
            if (!this.open_time_ranges[timeRange.fixed_date]) {
              this.open_time_ranges[timeRange.fixed_date] = {};
            }
            this.open_time_ranges[timeRange.fixed_date] = timeRange;
          });
        }

        this.refreshDatepicker();
      });
  }

  loadSocialUrls() {
    this.CustomerCompany.getSocialUrls(this.current_company_id, this.is_customer_reservation)
      .then((socials) => {
        this.socials = socials;
        this.socials_is_loaded = true;
      });
  }

  loadGeneralSettings() {
    this.Settings.getGeneralSettings(this.current_company_id, this.is_customer_reservation).then(
      (generalSettings) => {
        this.settings = generalSettings;
      });
  }

  loadWarningsSettings() {
    this.Settings
      .getWarningsSettings(this.current_company_id).then(
        (warnings) => {
          warnings.forEach((warning) => {
            if (warning.language.toLowerCase() === this.$translate.proposedLanguage().toLowerCase()) {
              this.warnings[warning.title] = warning.text;
            }
          });
        });
  }

  preloadData() {
    this.loadProducts();
    this.loadGeneralSettings();
    this.loadWarningsSettings();
    this.loadZones();

    if (this.is_dashboard_page || this.is_reservations || this.is_agenda) {
      this.loadTables();
    } else {
      this.loadSocialUrls();
    }
  }

  canLoadTime() {
    return this.current_part.product &&
           this.current_part.number_of_persons &&
           this.current_part.date;
  }

  validForm() {
    this.errors = this.NewReservation.validForm(
      this.reservation,
      this.settings.phone_number_is_required,
      this.is_customer_reservation,
      this.reservation.walk_in);
  }

  isPersonTab() {
    return this.tab_index === this.pagination.person - 1;
  }

  selectTab(index) {
    this.tab_index = index;
    if (index === 2) {
      this.checkDeadlineAndClosedDate();
    }
  }

  selectType(type) {
    if (type === 'regular') {
      this.selected_type_index = 1;
      this.reservation.walk_in = false;
    } else {
      this.selected_type_index = 2;
      this.reservation.walk_in = true;

      if (!this.current_part.number_of_persons) {
        this.current_part.number_of_persons = 2;
      }
    }
  }

  getProductWeekTimeRange(weekday, productId) {
    if (this.product_week_time_ranges &&
      this.product_week_time_ranges[weekday] &&
      this.product_week_time_ranges[weekday][productId]) {
      return this.product_week_time_ranges[weekday][productId];
    }

    return null;
  }

  getBackgroundStyles() {
    if (!this.showCustomBackground()) return null;
    return this.settings.plugin_image_file_name;
  }

  showCustomBackground() {
    return this.settings && this.settings.plugin_image_file_name && this.tab_index === 0;
  }
}
