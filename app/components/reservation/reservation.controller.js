import angular from 'angular';

export default class ReservationCtrl {
  constructor(User, Reservation, Product, Zone, Table, moment, filterFilter, $rootScope, $scope, $window, $modalInstance) {
    'ngInject';

    this.current_company = User.current_company;

    this.Reservation          = Reservation;
    this.Product              = Product;
    this.Zone                 = Zone;
    this.Table                = Table;

    this.$scope               = $scope;
    this.$rootScope           = $rootScope;
    this.filterFilter         = filterFilter;
    this.$window              = $window;
    this.$modalInstance       = $modalInstance;
    this.moment               = moment;

    this.date_options = {
      formatYear: 'yy',
      startingDay: 1,
      showWeeks: false,
      class: 'datepicker'
    };

    this.init_date             = new Date();
    this.format               = 'dd-MM-yyyy';

    this.reservation = {
      date: this.initDate,
      number_of_persons: undefined,
      time: undefined,
      language: 'NL',
      gender: 'Man'
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
      //reservation_pdf: this.reservation.reservation_pdf,
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
        gender: this.reservation.gender
      },
      reservation_parts: [{
        datetime: this.reservation.date + " " + this.reservation.time,
        person_count: this.reservation.person_count,
        product: this.reservation.product,
        tables: this.reservation.tables,
      }]
    }

    this.Reservation.create(data)
      .then((result) => {
        this.is_submitting = false;
        this.success       = true;
        this.$rootScope.$broadcast('DashboardCtrl.reload_reservations');
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

  closeModal() {
    this.$modalInstance.dismiss('cancel');
  }

  openDatepicker() {
    this.opened = true;
  }

  timeIsDisabled(time_obj) {
    if (this.reservation.person_count > time_obj.max_personen || time_obj.is_closed) {
      return true;
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
      return table.person_count;
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

  loadTime() {
    this.time_is_loaded = false;
    this.available_time = [];

    if (this.canLoadTime()) {
      this.Product
        .getAvailableTables(this.current_company.id, this.reservation.product, this.reservation.date)
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
      .getAll(this.current_company.id, false)
        .then(
          (result) => {
            this.products = result;
            this.products_is_loaded = true;
          },
          (error) => {
          });
  }

  loadZones() {
    this.zones_is_loaded = false;
    this.reservation.tables_values = [];
    this.zones           = [];

    this.Zone
      .getAll(this.current_company.id)
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
      .getAll(this.current_company.id)
        .then(
          (result) => {
            this.tables = result;
          },
          (error) => {
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
    this.loadZones();
    this.loadTables();
  }

  getReservationDateForSuccess() {
    return this.moment(this.reservation.full_date).format('DD MMMM YYYY');
  }
}
