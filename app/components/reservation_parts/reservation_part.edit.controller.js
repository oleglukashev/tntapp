import angular from 'angular';

export default class ReservationPartEditCtrl {
  constructor(User, ReservationPart, ReservationLogic, Settings, TimeRange, Product, Zone, Table, moment, filterFilter, $rootScope, $scope, $modalInstance, reservation, reservation_part) {
    'ngInject';

    this.current_company_id = User.current_company.id;

    this.ReservationPart      = ReservationPart;
    this.ReservationLogic     = ReservationLogic;
    this.Product              = Product;
    this.Zone                 = Zone;
    this.Table                = Table;
    this.Settings             = Settings;
    this.TimeRange            = TimeRange;

    this.$scope               = $scope;
    this.$rootScope           = $rootScope;
    this.filterFilter         = filterFilter;
    this.$modalInstance       = $modalInstance;

    this.moment               = moment;
    this.zones_is_showed      = true;

    this.init_date            = moment().subtract(1, 'Y');
    this.max_date             = moment().add(1, 'Y');

    this.reservation_part_id  = reservation_part.id;

    let current_reservation = reservation;
    let current_reservation_part = reservation_part;

    let datetime = current_reservation_part.date_time.split(' ');
    let time = datetime[1].split(':');

    this.reservation_part = {
      tables_values: {},
      full_date: datetime[0],
      date: datetime[0],
      person_count: parseInt(current_reservation_part.number_of_persons),
      product: current_reservation_part.product.id,
      time: [time[0], time[1]].join(':'),
    };

    current_reservation_part.table_ids.forEach(table_id => {
      this.reservation_part.tables_values[table_id] = true;
    });

    $scope.$watchCollection('reserv.reservation_part.product', () => {
      this.current_product = null;

      if (this.reservation_part.product) {
        this.current_product = this.filterFilter(this.products, { id: this.reservation_part.product })[0];
      }

      this.loadTime();
    });

    $scope.$watchCollection('reserv.reservation_part.person_count', () => {
      this.loadTime();
    });

    $scope.$watch('reserv.reservation_part.date', () => {
      this.reservation_part.date = this.moment(this.reservation_part.date).format('YYYY-MM-DD');
      this.preloadData();
    });

    $scope.$watch('reserv.reservation_part.full_date_of_birth', () => {
      this.reservation_part.date_of_birth = this.moment(this.reservation_part.full_date_of_birth).format('DD-MM-YYYY');
    });

    this.preloadData();
  }

  submitForm() {
    this.is_submitting = true;
    this.reservation_part.tables = [];
    let name = this.reservation_part.name || '';

    Object.keys(this.reservation_part.tables_values).forEach(key => {
      if (this.reservation_part.tables_values[key]) {
        this.reservation_part.tables.push(key);
      }
    });

    let data = {
      datetime: this.reservation_part.date + " " + this.reservation_part.time,
      person_count: this.reservation_part.person_count,
      product_id: this.reservation_part.product,
      tables: this.reservation_part.tables,
      part_id: this.reservation_part_id
    }

    this.ReservationPart.update(this.current_company_id, this.reservation_part_id, data)
      .then((result) => {
        this.is_submitting = false;
        this.$modalInstance.close();
        this.$rootScope.$broadcast('NewReservationCtrl.reload_reservations');
      },
      (error) => {
        this.is_submitting = false;
        this.errors = error;
      });
  }

  formIsValid() {
    return (
      this.reservation_part.date == null ||
      this.reservation_part.time == null ||
      this.reservation_part.product == null ||
      this.reservation_part.person_count == null
    )
  }

  setZone(zone) {
    this.zones_is_showed  = false;
    this.reservation_part.zone = zone
  }

  preloadData() {
    this.loadProducts();
    this.loadGeneralSettings();
    this.loadZones();
    this.loadTables();
    this.loadTime();
  }

  loadTime() {
    this.time_is_loaded = false;
    this.available_time = [];

    this.Product
      .getAvailableTables(this.current_company_id, this.reservation_part.product, this.reservation_part.date)
        .then(
          (result) => {
            this.available_time = result;
            this.time_is_loaded = true;
          },
          (error) => {
          });
  }

  loadProducts() {
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

  loadTimeRanges() {
    this.TimeRange.getAll(this.current_company_id)
      .then(
        ranges => {
          this.open_hours = {};
          ranges.forEach(range => {
            if (range.daysOfWeek[0] == this.moment(this.reservation_part.date).isoWeekday()) {
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

}
