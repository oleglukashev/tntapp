import angular from 'angular';

export default class ReservationCtrl {
  constructor(Upload, Reservation, Product, Zone, Table, moment, filterFilter, $scope, $window, $modalInstance) {
    'ngInject';

    this.Upload               = Upload;
    this.Reservation          = Reservation;
    this.Product              = Product;
    this.Zone                 = Zone;
    this.Table                = Table;

    this.$scope               = $scope;
    this.filterFilter         = filterFilter;
    this.$window              = $window;
    this.$modalInstance       = $modalInstance;
    this.moment               = moment;

    this.dateOptions = {
      formatYear: 'yy',
      startingDay: 1,
      showWeeks: false,
      class: 'datepicker'
    };

    this.initDate             = new Date();
    this.format               = 'dd-MM-yyyy';

    this.reservation = {
      date: this.initDate,
      number_of_persons: undefined,
      time: undefined,
      language: 'NL',
      gender: 'Man',
      is_group: "0"
    };

    //states
    this.additional_is_opened    = false;
    this.is_success              = false;

    $scope.$watchCollection('reserv.reservation.product', () => {
      this.current_product = null;
      this.$window.console.log('reservation.product changed');

      if (this.reservation.product) {
        this.current_product = this.filterFilter(this.products, { id: this.reservation.product })[0];
      }

      this.loadTime();
    });

    $scope.$watchCollection('reserv.reservation.person_count', () => {
      this.$window.console.log('reservation.person_count changed');
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

    $scope.$watchCollection('reserv.reservation.full_date', () => {
      this.$window.console.log('reservation.full_date changed');
      this.reservation.date = this.moment(this.reservation.full_date).format('DD-MM-YYYY')
    });

    this.preloadData();
  }

  triggerAdditionalInfo() {
    this.additional_is_opened = !this.additional_is_opened;
  }

  triggerChoosePersonCount() {
    this.choose_person_count_is_opened = !this.choose_person_count_is_opened;
  }

  sendForm() {
    let data = {
      language: this.reservation.language,
      send_confirmation: this.reservation.send_confirmation ? "1" : "0",
      //reservationPDF: this.reservation.reservationPDF,
      notes: this.reservation.notes,
      is_group: this.reservation.is_group ? "1" : "0",
      company_name: this.reservation.companyName,
      //aantal_personen: this.reservation.person_count,
      customer: {
        last_name: this.reservation.name,
        first_name: this.reservation.name,
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
        this.success = true;
      },
      (error) => {
        this.errors = error;
      });
  }

  formIsValid() {
    return (
              typeof this.reservation.date == 'undefined' ||
              typeof this.reservation.person_count == 'undefined' ||
              typeof this.reservation.time == 'undefined'
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
      this.Product.getAvailableTables(this.reservation.product, this.reservation.date)
        .then(
          (result) => {
            this.available_time = result;
            this.time_is_loaded = true;
          });
    }
  }

  loadProducts() {
    this.products_is_loaded = false;
    this.products           = [];

    this.Product.getAll(false)
      .then(
        (result) => {
          this.products = result;
          this.products_is_loaded = true;
        });
  }

  loadZones() {
    this.zones_is_loaded = false;
    this.zones           = [];

    this.Zone.getAll()
      .then(
        (result) => {
          this.zones = result;
          this.zones_is_loaded = true;
        });
  }

  loadTables() {
    this.tables = [];

    this.Table.getAll()
      .then(
        (result) => {
          this.tables = result;
        });
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
}
