import angular from 'angular';

export default class Controller {
  constructor(User, Reservation, Settings, TimeRange, Product, Zone,
    NewReservation, AppConstants, Availability, ReservationPart, moment, $stateParams,
    $rootScope, $window, $translate, $q, $scope, $timeout) {
    'ngInject';

    this.Reservation = Reservation;
    this.ReservationPart = ReservationPart;
    this.NewReservation = NewReservation;
    this.Product = Product;
    this.Availability = Availability;
    this.Zone = Zone;
    this.Settings = Settings;
    this.TimeRange = TimeRange;
    this.AppConstants = AppConstants;
    this.moment = moment;
    this.$rootScope = $rootScope;
    this.$window = $window;
    this.$translate = $translate;
    this.selected_zone = null;
    this.$scope = $scope;
    this.$q = $q;
    this.$timeout = $timeout;

    this.errors = [];

    this.product_week_time_ranges = {};
    this.product_time_ranges = {};
    this.zone_time_ranges = {};
    this.open_time_ranges = {};
    this.warnings = {};

    this.allergy_data = { owner: null, allergy: null };
    this.preference_data = { owner: null, name: null, value: null };

    this.is_submitting = false;
    this.reservation = this.getReservationSamlpe();
    this.current_index = 0;

    this.$onInit = () => {
      if (this.type === 'customer') {
        this.current_company_id = $stateParams.id;
        this.pagination = this.Reservation.pagination.customer;
      } else {
        this.current_company_id = User.getCompanyId();
        this.pagination = this.Reservation.pagination.backend;
      }

      this.reservation.reservation_parts.push(this.ReservationPart.getNewReservationPart());
      this.current_part = this.reservation.reservation_parts[this.current_index];
      if ($stateParams.aantal_personen) {
        this.current_part.number_of_persons = parseInt($stateParams.aantal_personen);
      }

      this.preloadData();
    };
  }

  preloadData() {
    const isCustomer = this.type === 'customer';

    this.$q.all([
      this.Product.getAll(this.current_company_id, !isCustomer, isCustomer),
      this.Zone.getAll(this.current_company_id, isCustomer),
      this.TimeRange.getAll(this.current_company_id, null, isCustomer),
      this.Settings.getWarningsSettings(this.current_company_id),
    ]).then((result) => {
      this.initProducts(result[0]);
      this.initZones(result[1]);
      this.initTimeRanges(result[2]);
      this.initWarningsSettings(result[3]);
    });
  }

  submitForm(form) {
    this.validForm(form);
    if (this.errors.length) return false;

    const data = this.prepareFormData();

    this.is_submitting = true;
    this.$rootScope.show_spinner = true;

    this.Reservation
      .create(this.current_company_id, data, this.type === 'customer')
      .then((result) => {
        if (result.status === 200) {
          this.response = result.data;
          this.$rootScope.$broadcast('NewReservationCtrl.reload_reservations');
          this.isSuccess = true;
        } else if (result.status === 400) {
          this.errors = result.data.errors.errors;
        }

        this.is_submitting = false;
        this.$rootScope.show_spinner = false;
      }, (error) => {
        this.$rootScope.show_spinner = false;
        this.is_submitting = false;
        this.errors = error.data.errors.errors;
      });

    return true;
  }

  prepareFormData() {
    const dateOfBirth = this.reservation.date_of_birth ?
      this.moment(this.reservation.date_of_birth).format('DD-MM-YYYY') :
      undefined;

    let data = {
      is_customer: this.type === 'customer',
      language: this.reservation.language,
      send_confirmation: this.reservation.send_confirmation,
      corona_confirmation: this.reservation.corona_confirmation,
      notes: this.reservation.notes,
      is_group: this.reservation.is_group,
      company_name: this.reservation.company_name,
      customer: {
        last_name: this.reservation.last_name,
        first_name: this.reservation.first_name,
        primary_phone_number: this.reservation.primary_phone_number,
        country: this.reservation.country,
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

    if (!data.customer.first_name) data.customer.first_name = null;
    if (!data.customer.last_name) data.customer.last_name = null;
    if (this.reservation.reservation_pdf) data.reservation_pdf = this.reservation.reservation_pdf;

    this.preparePreferencesAndAllergies(data);

    this.reservation.reservation_parts.forEach((part) => {
      data.reservation_parts.push({
        number_of_persons: part.number_of_persons,
        product: part.product.id,
        tables: part.tables.map(table => table.id),
        date_time: `${this.moment(part.date).format('DD-MM-YYYY')} ${part.time}`,
      });
    });

    data = this.setSocialAccountData(data);

    this.$window.localStorage.removeItem('social_account');

    return data;
  }

  loadTime() {
    this.current_part.available_time = [];
    this.current_part.available_time_is_loaded = false;

    if (this.canLoadTime()) {
      const companyId = this.current_company_id;
      const product = this.current_part.product;
      const reservationDate = this.moment(this.current_part.date).format('YYYY-MM-DD');
      const numberOfPersons = this.current_part.number_of_persons;
      this.$rootScope.show_spinner = true;

      this
        .Availability
        .getAvailabilities(companyId, product.id, reservationDate, numberOfPersons, this.type === 'customer')
        .then((result) => {
          this.$rootScope.show_spinner = false;
          this.current_part.available_time = result;
          this.current_part.available_time_is_loaded = true;
        }, () => {
          this.$rootScope.show_spinner = false;
        });
    }
  }

  clearAndLoadTime() {
    this.current_part.time = null;
    this.loadTime();
  }

  canLoadTime() {
    return this.current_part.product &&
           this.current_part.number_of_persons &&
           this.current_part.date;
  }

  validForm(form) {
    this.errors = this.NewReservation.validForm(
      this.reservation,
      this.settings.phone_number_is_required,
      this.type === 'customer',
      false,
      form);
  }

  selectTab(index) {
    this.$timeout(() => {
      this.tabIndex = index;
    }, 100);
  }

  selectCurrentIndex(index) {
    this.current_index = index;
    this.current_part = this.reservation.reservation_parts[this.current_index];
  }

  // TODO optimize it
  preparePreferencesAndAllergies(data) {
    if (this.allergyIsValid()) this.addAllergy();
    if (this.preferenceIsValid()) this.addPreference();

    if (this.reservation.allergies.length) {
      data.customer.allergies = this.reservation.allergies;
    }

    if (this.reservation.preferences.length) {
      data.customer.preferences = this.reservation.preferences;
    }
  }

  setSocialAccountData(data) {
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

    return data;
  }

  getReservationSamlpe() {
    return {
      country: 'NL',
      language: this.$translate.proposedLanguage().toUpperCase() || 'NL',
      gender: 'Man',
      social: null,
      is_group: false,
      send_confirmation: true,
      corona_confirmation: true,
      reservation_parts: [],
      allergies: [],
      preferences: [],
      walk_in: false,
    };
  }

  addAllergy() {
    this.reservation.allergies.push(angular.copy(this.allergy_data));
    this.allergy_data.owner = null;
    this.allergy_data.allergy = null;
  }

  addPreference() {
    this.reservation.preferences.push(angular.copy(this.preference_data));
    this.preference_data.owner = null;
    this.preference_data.name = null;
    this.preference_data.value = null;
  }

  preferenceIsValid() {
    return this.preference_data.owner && this.preference_data.name && this.preference_data.value;
  }

  allergyIsValid() {
    return this.allergy_data.owner && this.allergy_data.allergy;
  }

  initWarningsSettings(warnings) {
    warnings.forEach((warning) => {
      if (warning.language.toLowerCase() === this.$translate.proposedLanguage().toLowerCase()) {
        this.warnings[warning.title] = warning.text;
      }
    });
  }

  initTimeRanges(ranges) {
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

    // refresh datePicker
    this.$scope.$broadcast('refreshDatepickers');
  }

  initZones(zones) {
    this.tables = [];
    this.zones = zones;
    this.zones.forEach((zone) => {
      zone.tables.forEach((table) => {
        this.tables.push(table);
      });
    });

    // refresh datePicker
    this.$scope.$broadcast('refreshDatepickers');
  }

  initProducts(products) {
    this.products = products;

    // refresh datePicker
    this.$scope.$broadcast('refreshDatepickers');
  }
}
