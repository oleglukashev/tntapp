import angular from 'angular';

export default class AgendaCtrl {
  constructor(User, Zone, Table, TimeRange, Product, Reservation, ReservationStatus, ReservationPart, filterFilter, $scope, $rootScope, $modal, moment, $timeout) {
    'ngInject';

    this.current_company = User.current_company;

    this.Table           = Table;
    this.Zone            = Zone;
    this.Product         = Product;
    this.TimeRange       = TimeRange;
    this.Reservation     = Reservation;
    this.ReservationPart = ReservationPart;
    this.ReservationStatus = ReservationStatus;
    this.filterFilter    = filterFilter;
    this.moment          = moment;
    this.$modal          = $modal;
    this.$timeout        = $timeout;
    this.$scope          = $scope;
    this.$rootScope      = $rootScope;
    this.is_loaded       = false;
    this.tables_by_zone  = {};
    this.errors          = [];
    this.opened          = [true];
    this.tables_by_part  = {};
    this.products        = {};
    this.open_hours      = {};
    // generating array from 00 to 23
    this.hours           = Array.from(Array(24).keys()).map( (h) => (h < 10) ? '0' + h.toString() : h.toString() );

    this.draggable_class    = '';

    this.reservations_view  = 'calendar';

    this.left_margin        = 36;
    this.top_margin         = 30;
    this.hour_width         = 101;
    this.reservation_height = 30;
    this.now_left_px        = this.left_margin + (new Date()).getHours() * this.hour_width +
      (new Date()).getMinutes() / 60 * this.hour_width;

    $rootScope.$on('ANGULAR_DRAG_START', (obj, event) => {
      this.dragged_product = event.target.attributes['data-product-id'].value;
    });

    $rootScope.$on('ANGULAR_DRAG_END', () => {
      this.dragged_product = 0;
    });

    $rootScope.$on('PageFilterCtrl.change_view', (obj, view) => {
      this.loadReservations();
      this.reservations_view = view;
    });

    $scope.$on('PageFilterCtrl.change_date_filter', (event, date) => {
      this.date_filter  = date;
      this.current_day  = (new Date(date)).getDay();
      this.is_loaded    = false;
      this.is_today     = false;
      this.reservations = [];
      this.loadReservations();
      if (this.moment().format('YYYY-MM-DD') == this.moment(date).format('YYYY-MM-DD')) {
        this.is_today = true;

        // scrolling left for now line
        this.$timeout(() => {
          $('.agenda .panel-body').animate({scrollLeft: this.now_left_px}, "slow");
        }, 1000);
      }
    });

    $scope.$on('NewReservationCtrl.reload_reservations', () => {
      this.loadReservations();
    });

    this.loadZonesAndTables();
  }

  onDrop(zone_id, table_id, table_position, hour, quarter, reservation_part_id) {
    let tables = this.tables_by_part;

    let data = {
        part_id : reservation_part_id,
        tijdstip: this.moment(this.date_filter).format('YYYY-MM-DD') + ' ' + hour + ':' + quarter * 15 + ':00',
        tafels  : [table_id]
     };

    for (let table in tables) {
      for (let i=0; i<tables[table].length; i++) {
        let item = tables[table][i];
        if (item.id == reservation_part_id) {

          this.ReservationPart.edit(this.current_company.id, reservation_part_id, data).then(() => {
            let left = this.left_margin + hour * this.hour_width + quarter * this.hour_width / 4;
            let top = this.top_margin + table_position * this.reservation_height;
            item.left = left;
            item.top = top;

            if (!tables[table_id]) tables[table_id] = [];
            tables[table_id].push(tables[table].splice(i, 1)[0]);
          });
        }
      }
    }
  }

  openReservation() {
    let modalInstance = this.$modal.open({
      templateUrl: 'dashboard_reservations.new.view.html',
      controller: 'DashboardReservationsReservationCtrl as dash_reserv',
      size: 'md'
    });

    modalInstance.result.then((selectedItem) => {
      this.loadReservations();
    }, () => {
      this.loadReservations();
    });
  }

  getQuarterClass(hour, quarter) {
    let timePart = hour*4 + quarter;
    if (this.open_hours[this.dragged_product] && (
        timePart < this.open_hours[this.dragged_product].start ||
        timePart > this.open_hours[this.dragged_product].end
      )) {
        return "inactive";
    }
  }

  loadTables() {
    this.Table
      .getAll(this.current_company.id)
        .then(
          (tables) => {
            this.tables    = tables;
            this.is_loaded = true;

            this.zones.forEach((zone) => {
              this.tables_by_zone[zone.id] = this.filterFilter(tables, { zones: zone.id }).map((item) => {
                return {
                  id                : item.id,
                  table_number      : parseInt(item.table_number),
                  number_of_persons : parseInt(item.number_of_persons),
                  position          : parseInt(item.position),
                  zones             : item.zones
                }
              });
            });
            this.loadTimeRanges();
          });
  }

  loadTimeRanges() {
    this.TimeRange.getAll(this.current_company.id)
      .then(
        (ranges) => {
          ranges.forEach((range) => {
            if (range.daysOfWeek[0] == this.current_day) {
              let startTime = range.startTime.split(':');
              let endTime   = range.endTime.split(':');
              this.open_hours[range.productId] = {
                start: startTime[0]*4 + startTime[1]/15,
                end  : endTime[0]*4 + endTime[1]/15,
              };
            }

          });
          this.loadReservations();
        });
  }

  loadReservations() {
    this.Reservation.getAll(this.current_company.id, this.moment(this.date_filter).format('YYYY-MM-DD'))
      .then(
        (reservations) => {
          this.tables_by_part = [];
          this.reservations = this.ReservationStatus.translateAndcheckStatusForDelay(reservations);
          reservations.forEach((reservation) => {
            let parts = reservation.reservation_parts;
            parts.forEach((part) => {
              if (this.moment(this.date_filter).startOf('day').isSame(this.moment(part.date_time).startOf('day'))) {
                part.table_ids.forEach((table_id) => {
                  if (!this.tables_by_part[table_id]) this.tables_by_part[table_id] = [];
                  part.left = this.timeToCoords(part.date_time);
                  part.customer = reservation.customer;
                  this.tables_by_part[table_id].push(part);
                })
              }
            });
          });
          this.loadProducts();
          this.is_loaded = true;
        });
  }

  loadProducts() {
    this.Product.getAll(this.current_company.id)
      .then(
        (products) => {
          products.forEach((product) => {
            this.products[product.id] = product.name;
          });
        });
  }

  timeToCoords(datetime) {
    let time = new Date(datetime);
    return this.left_margin + (time.getHours() * this.hour_width) +
      time.getMinutes() / 60 * this.hour_width;
  }

  loadZonesAndTables() {
    this.Zone.getAll(this.current_company.id)
      .then(
        (result) => {
          this.zones = result;
          this.loadTables();
        },
        (error) => {
        });
  }

  getTableIdsByTablesList(tables_list) {
    let result = [];
    if (tables_list) {
      tables_list.forEach((table) => {
        result.push(table.id);
      });
    }
    return result;
  }

  getTableNumbersByTableIds(table_ids) {
    let result = [];
    table_ids.forEach((value) => {
      let table = this.filterFilter(this.tables, { id: value });
      if (table) {
        result.push(table[0].table_number);
      }
    }, result);
    return result;
  }

  // if we will need validation
  // dropValidate(hour, quarter) {
  //   let timePart = hour*4 + quarter;

  //   if (this.open_hours[this.dragged_product]) {
  //     if (timePart >= this.open_hours[this.dragged_product].start &&
  //         timePart <= this.open_hours[this.dragged_product].end) {
  //       return "true";
  //     } else {
  //       return "true";
  //     }
  //   }
  // }

}