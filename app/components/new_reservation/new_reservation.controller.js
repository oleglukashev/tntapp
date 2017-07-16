import angular from 'angular';

export default class NewReservationCtrl {
  constructor(User, Reservation, Settings, TimeRange, CustomerCompany, Product, Zone, Table, moment, filterFilter, $state,
    $stateParams, $rootScope, $scope, $window, $auth) {
    'ngInject';

    this.is_dashboard_page    = $state.current.name == 'app.dashboard';
    this.is_reservations      = $state.current.name == 'app.reservations';
    this.is_agenda            = $state.current.name == 'app.agenda';
    this.is_customer_reservation = $state.current.name == 'customer_reservation.new';

    this.current_company_id = this.is_dashboard_page || this.is_reservations || this.is_agenda
                              ? User.current_company.id
                              : $stateParams.id;

    this.Reservation          = Reservation;
    this.CustomerCompany      = CustomerCompany;
    this.Product              = Product;
    this.Zone                 = Zone;
    this.Table                = Table;
    this.Settings             = Settings;
    this.TimeRange            = TimeRange;

    this.$auth                = $auth;
    this.$scope               = $scope;
    this.$rootScope           = $rootScope;
    this.filterFilter         = filterFilter;
    this.$window              = $window;

    this.moment               = moment;
    this.zones_is_showed      = true;

    this.date_options = {
      formatYear: 'yy',
      startingDay: 1,
      showWeeks: false,
      class: 'datepicker'
    };

    this.init_date            = new Date();
    this.max_date             = moment().add(1, 'Y');
    this.format               = 'dd-MM-yyyy';

    this.reservation = {
      date: this.initDate,
      number_of_persons: null,
      time: null,
      language: 'NL',
      gender: 'Man',
      social: null
    };

    //states
    this.additional_is_opened    = false;
    this.is_success              = false;

    $scope.$watchCollection('reserv.reservation.product', () => {
      this.current_product = null;

      if (this.reservation.product) {
        this.current_product = this.filterFilter(this.products, { id: this.reservation.product })[0];
      }

      this.loadTime();
    });

    $scope.$watchCollection('reserv.reservation.person_count', () => {
      this.loadTime();
    });

    $scope.$watchCollection('reserv.reservation.tables_values', () => {
      let that = this;
      this.reservation.tables = [];

      angular.forEach(that.reservation.tables_values, (value, key) => {
        if (value) {
          that.reservation.tables.push(key);
        }
      });
    });

    $scope.$watch('reserv.reservation.full_date', () => {
      this.reservation.date         = this.moment(this.reservation.full_date).format('DD-MM-YYYY');
      this.reservation.person_count = null;
      this.reservation.time         = null;
      this.preloadData();
    });

    $scope.$watch('reserv.reservation.full_date_of_birth', () => {
      this.reservation.date_of_birth = this.moment(this.reservation.full_date_of_birth).format('DD-MM-YYYY');
    });

    this.preloadData();
  }

  triggerAdditionalInfo() {
    this.additional_is_opened = !this.additional_is_opened;
  }

  triggerChoosePersonCount() {
    this.choose_person_count_is_opened = !this.choose_person_count_is_opened;
  }

  submitForm() {
    this.is_submitting = true;
    let name = this.reservation.name || '';

    let data = {
      language: this.reservation.language,
      send_confirmation: this.reservation.send_confirmation ? "1" : "0",
      notes: this.reservation.notes,
      is_group: this.reservation.is_group ? "1" : "0",
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
        date_of_birth: this.reservation.date_of_birth,
        gender: this.reservation.gender,
        regular: 0
      },
      reservation_parts: [{
        datetime: this.reservation.date + " " + this.reservation.time,
        person_count: this.reservation.person_count,
        product: this.reservation.product,
        tables: this.reservation.tables,
      }],
      reservation_pdf: this.reservation.pdfFile
    }

    let social_account = JSON.parse(this.$window.localStorage.getItem('social_account'));

    if (this.reservation.social && social_account) {
      data.social_account      = social_account;
      data.social_account.type = this.reservation.social;
    }

    let create_method = this.is_customer_reservation ?
                        this.Reservation.createCustomerReservation(this.current_company_id, data) :
                        this.Reservation.create(this.current_company_id, data);

    this.$window.localStorage.removeItem('social_account');

    create_method
      .then((result) => {
        this.is_submitting = false;
        this.success       = true;
        this.$rootScope.$broadcast('NewReservationCtrl.reload_reservations');
      },
      (error) => {
        this.is_submitting = false;
        this.errors = error;
      });
  }

  formIsValid() {
    return (
              this.reservation.date == null ||
              this.reservation.person_count == null ||
              this.reservation.time == null ||
              this.reservation.product == null
           )
  }

  openDatepicker() {
    this.opened = true;
  }

  timeIsDisabled(time_obj) {
    if (this.reservation.person_count > time_obj.max_personen ||
        time_obj.is_closed ||
        time_obj.time_is_past
        ) {
      return true;
    }

    if (this.is_customer_reservation) {
      let not_enough_room_in_restaurant = (this.reservation.person_count > time_obj.available_seat_count ||
                                           this.reservation.person_count > time_obj.max_personen_voor_tafels) &&
                                           !time_obj.can_overbook;

      if (not_enough_room_in_restaurant || time_obj.more_than_deadline) {
        return true;
      }
    }


    if (this.current_product) {
      let obj_time = this.moment(this.reservation.date + ' ' + time_obj.time);
      let start_product_time = this.moment(this.reservation.date + ' ' + this.current_product.start_time);
      let end_product_time = this.moment(this.reservation.date + ' ' + this.current_product.end_time);

      if (
          (obj_time <= end_product_time && obj_time >= start_product_time) &&
          (this.current_product.max_person_count &&
          this.current_product.max_person_count < this.reservation.person_count) ||
          this.current_product.min_person_count > this.reservation.person_count) {

        return true;
      }
    }

    return false;
  }

  getPersonCountByTableId(table_id) {
    let table = this.filterFilter(this.tables, { id: table_id })[0];

    if (table) {
      return table.number_of_persons;
    } else {
      return null;
    }
  }

  getTableNumberByTableId(table_id) {
    let table = this.filterFilter(this.tables, { id: table_id })[0];

    if (table) {
      return table.table_number;
    } else {
      return null;
    }
  }

  isDisabledTableByTableId(table_id) {
    let table = this.filterFilter(this.tables, { id: table_id })[0];

    if (table) {
      return table.hidden == true;
    } else {
      return false;
    }
  }

  getProductNameByProductId(product_id) {
    let product = this.filterFilter(this.products, { id: product_id })[0];

    if (product) {
      return product.name;
    } else {
      return null;
    }
  }

  setZone(zone) {
    this.zones_is_showed  = false;
    this.reservation.zone = zone
  }

  loadTime() {
    this.time_is_loaded = false;
    this.available_time = [];

    if (this.canLoadTime()) {
      this.Product
        .getAvailableTables(this.current_company_id, this.reservation.product, this.reservation.date)
          .then(
            (result) => {
              this.available_time = result;
              this.time_is_loaded = true;
            },
            (error) => {
            });
    }
  }

  loadProducts() {
    this.reservation.product = null;
    this.products_is_loaded  = false;
    this.products            = [];
    this.Product
      .getAll(this.current_company_id, false)
        .then(
          (result) => {
            this.products = result;
            this.products_is_loaded = true;

            this.loadTimeRanges();
          },
          (error) => {
          });
  }

  loadZones() {
    this.zones_is_loaded = false;
    this.reservation.tables_values = [];
    this.zones           = [];

    this.Zone
      .getAll(this.current_company_id)
        .then(
          (result) => {
            this.zones = result;
            this.zones_is_loaded = true;
          },
          (error) => {
          });
  }

  loadTables() {
    this.tables = [];

    this.Table
      .getAll(this.current_company_id)
        .then(
          (result) => {
            this.tables = result;
          },
          (error) => {
          });
  }

  loadSocialUrls() {
    this.CustomerCompany
      .getSocialUrls(this.current_company_id)
        .then(
          (socials) => {
            this.socials           = socials;
            this.socials_is_loaded = true;
          });
  }

  selectTab(index) {
    this.selected_index = index;
  }

  canLoadTime() {
    return this.reservation.product &&
           this.reservation.person_count &&
           this.reservation.date
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
        ranges => {
          this.open_hours = {};
          ranges.forEach(range => {
            if (range.daysOfWeek[0] == this.moment().isoWeekday()) {
              let currentTime = this.moment();
              let startTime = this.moment(range.startTime, "HH:mm");
              let endTime = this.moment(range.endTime, "HH:mm");

              let product_is_active = currentTime.isBetween(startTime, endTime);

              for (let i=0; i<this.products.length; i++) {
                if (this.products[i].id == range.productId)
                  this.products[i].hidden = !product_is_active;
              }
            }
          });
        });
  }

  loadGeneralSettings() {
    this.Settings
      .getGeneralSettings(this.current_company_id)
        .then(
          (general_settings) => {
            this.settings = general_settings;
          });
  }

  getReservationDateForSuccess() {
    return this.moment(this.reservation.full_date).format('DD MMMM YYYY');
  }

  authenticate(provider) {
    this.reservation.social = provider;

    if (provider === 'email') {
      this.selectTab(1);
    } else {
      this.$auth.authenticate(provider).then(
      (response) => {
        this.$window.localStorage.setItem('social_account', JSON.stringify(response.data));
        this.reservation.name                 = response.data.name;
        this.reservation.mail                 = response.data.email;
        this.reservation.full_date_of_birth   = response.data.date_of_birth;
        this.reservation.primary_phone_number = response.data.primary_phone_number;
        if (response.data.gender) {
          this.reservation.gender             = response.data.gender;
        }

        this.selectTab(1);
      }, (error) => {
        // nothing
      });
    }
  }
}
