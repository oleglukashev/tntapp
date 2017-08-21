export default class AgendaCtrl {
  constructor(User, Settings, Zone, Table, TimeRange, Product, Reservation, ReservationStatus,
    ReservationPart, filterFilter, $scope, $rootScope, $modal, moment, $timeout) {
    'ngInject';

    this.current_company_id = User.getCompanyId();

    this.Settings = Settings;
    this.Table = Table;
    this.Zone = Zone;
    this.Product = Product;
    this.TimeRange = TimeRange;
    this.Reservation = Reservation;
    this.ReservationPart = ReservationPart;
    this.ReservationStatus = ReservationStatus;
    this.filterFilter = filterFilter;
    this.moment = moment;
    this.$modal = $modal;
    this.$timeout = $timeout;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.is_loaded = false;
    this.tables_by_zone = {};
    this.errors = [];
    this.opened = [true];
    this.tables_by_part = {};
    this.products = {};
    this.open_hours = {};

    // generating array from 00 to 23
    this.hours = Array.from(Array(24).keys()).map((h) => {
      return (h < 10) ? `0${h.toString()}` : h.toString();
    });

    this.draggable_class = '';
    this.channel = '';

    this.reservations_view = 'calendar';

    this.left_margin = 0;
    this.top_margin = 30;
    this.hour_width = 100;
    this.reservation_height = 30;
    this.minimal_width = this.hour_width / 2;
    this.now_left_px = this.left_margin + ((new Date()).getHours() * this.hour_width) +
      (((new Date()).getMinutes() / 60) * this.hour_width);

    this.reservation_block_width = this.hour_width * 1.5;

    $rootScope.$on('ANGULAR_DRAG_START', (obj, event, channel) => {
      if (!this.channel) {
        this.channel = channel;
      }

      if (channel === 'move' && event.target.attributes['data-product-id']) {
        this.dragged_product = event.target.attributes['data-product-id'].value;
      }

      this.draggable_class = 'dragged';
    });

    $rootScope.$on('ANGULAR_DRAG_END', () => {
      this.dragEnd();
    });

    $rootScope.$on('PageFilterCtrl.change_view', (obj, view) => {
      if (this.reservations_view !== view) {
        this.loadReservations();
        this.reservations_view = view;
        this.scrollToNow();
      }
    });

    $scope.$on('PageFilterCtrl.change_date_filter', (event, date) => {
      this.date_filter = date;
      this.current_day = (new Date(date)).getDay();
      this.is_loaded = false;
      this.is_today = false;
      this.reservations = [];
      this.loadReservations();
      if (this.moment().format('YYYY-MM-DD') === this.moment(date).format('YYYY-MM-DD')) {
        this.is_today = true;

        this.scrollToNow();
      }
    });

    $scope.$on('NewReservationCtrl.reload_reservations', () => {
      this.loadReservations();
    });

    this.loadGeneralSettings();
    this.loadZonesAndTables();
  }

  // scrolling left for now line
  scrollToNow(index) {
    if (this.is_today) {
      const eq = index === undefined ? '' : `:eq(${index})`;
      this.$timeout(() => {
        $(`.calendar_wrapper${eq}`).animate({ scrollLeft: this.now_left_px }, 'slow');
      }, 500);
    }
  }

  dragEnd() {
    this.dragged_product = 0;
    this.draggable_class = '';
  }

  onDrop(tableId, tablePosition, hour, quarter, reservationPartId) {
    const tables = this.tables_by_part;

    for (const table in tables) {
      for (let i = 0; i < tables[table].length; i += 1) {
        const item = tables[table][i];
        if (item.id === reservationPartId) {

          if (this.channel === 'resize') {
            const difference = (((hour * 4) + quarter) - ((this.moment(item.date_time).get('hour') * 4) +
              (this.moment(item.date_time).get('minute') / 15)));

            if ((difference * this.hour_width) / 4 > this.minimal_width) {
              const data = {
                part_id: reservationPartId,
                datetime: this.moment(this.date_filter).format('YYYY-MM-DD') + ' ' + this.moment(item.date_time).format('HH') + ':' + this.moment(item.date_time).format('mm') + ':00',
                tables: Object.values(item.table_ids),
                duration_minutes: difference * 15,
              };

              this.ReservationPart.update(this.current_company_id, reservationPartId, data)
              .then(() => {
                item.width = (difference * this.hour_width) / 4;
                this.dragEnd();
              });
            }
          } else if (this.channel === 'move') {
            const data = {
              part_id: reservationPartId,
              datetime: this.moment(this.date_filter).format('YYYY-MM-DD') + ' ' + hour + ':' + (quarter * 15) + ':00',
              tables: [tableId],
            };

            this.ReservationPart.update(this.current_company_id, reservationPartId, data)
            .then((part) => {
              const left = this.left_margin + (hour * this.hour_width)
                + ((quarter * this.hour_width) / 4);
              const top = this.top_margin + (tablePosition * this.reservation_height);
              item.left = left;
              item.top = top;
              item.date_time = part.date_time;
              item.table_ids = part.table_ids;

              if (!tables[tableId]) tables[tableId] = [];
              tables[tableId].push(tables[table].splice(i, 1)[0]);
            });
          }
        }
      }
    }
    this.channel = '';
  }

  openReservation() {
    const modalInstance = this.$modal.open({
      templateUrl: 'dashboard_reservations.new.view.html',
      controller: 'DashboardReservationsReservationCtrl as dash_reserv',
      size: 'md',
    });

    modalInstance.result.then(() => {
      this.loadReservations();
    }, () => {
      this.loadReservations();
    });
  }

  openQuickReservation(tableId, tableNumber, hour, quarter) {
    const modalInstance = this.$modal.open({
      templateUrl: 'agenda_quick_reservation.view.html',
      controller: 'AgendaQuickReservationCtrl as quick_reserv',
      size: 'md',
      resolve: {
        datetime: () => {
          const datetime = this.moment(this.date_filter);
          datetime.set({hour: hour, minute: quarter * 15, second: 0 });
          return datetime;
        },
        tableNumber: () => tableNumber,
        tableId: () => tableId,
      },
    });

    modalInstance.result.then((selectedItem) => {
      this.loadReservations();
    }, () => {
      this.loadReservations();
    });
  }

  getQuarterClass(hour, quarter) {
    const timePart = (hour * 4) + quarter;
    if (this.open_hours[this.dragged_product] && (
        timePart < this.open_hours[this.dragged_product].start ||
        timePart > this.open_hours[this.dragged_product].end
      )) {
      return 'inactive';
    }
    return '';
  }

  loadTables() {
    this.Table
      .getAll(this.current_company_id)
        .then(
          (tables) => {
            this.tables = tables;
            this.is_loaded = true;

            this.zones.forEach((zone) => {
              this.tables_by_zone[zone.id] = this.filterFilter(tables, { zones: zone.id })
              .map((item) => {
                return {
                  id: item.id,
                  table_number: parseInt(item.table_number, 10),
                  number_of_persons: parseInt(item.number_of_persons, 10),
                  position: parseInt(item.position, 10),
                  zones: item.zones,
                };
              });
            });
            this.loadTimeRanges();
          });
  }

  loadTimeRanges() {
    this.TimeRange.getAll(this.current_company_id)
      .then(
        (ranges) => {
          ranges.forEach((range) => {
            if (range.daysOfWeek[0] === this.current_day) {
              const startTime = range.startTime.split(':');
              const endTime = range.endTime.split(':');
              this.open_hours[range.productId] = {
                start: (startTime[0] * 4) + (startTime[1] / 15),
                end: (endTime[0] * 4) + (endTime[1] / 15),
              };
            }
          });
          this.loadReservations();
        });
  }

  loadReservations() {
    this.Reservation.getAll(this.current_company_id, this.moment(this.date_filter).format('YYYY-MM-DD'))
      .then(
        (reservations) => {
          this.tables_by_part = [];
          this.reservations = this.ReservationStatus.translateAndcheckStatusForDelay(reservations);
          reservations.forEach((reservation) => {
            const parts = reservation.reservation_parts;
            parts.forEach((part) => {
              if (this.moment(this.date_filter).startOf('day').isSame(this.moment(part.date_time).startOf('day'))) {
                part.table_ids.forEach((tableId) => {
                  if (!this.tables_by_part[tableId]) this.tables_by_part[tableId] = [];
                  part.left = this.timeToCoords(part.date_time);
                  part.width = this.durationToWidth(part.duration_minutes);
                  part.customer = reservation.customer;
                  this.tables_by_part[tableId].push(part);
                });
              }
            });
          });
          this.loadProducts();
          this.is_loaded = true;
        });
  }

  loadProducts() {
    this.Product.getAll(this.current_company_id)
      .then(
        (products) => {
          products.forEach((product) => {
            this.products[product.id] = product.name;
          });
        });
  }

  durationToWidth(durationMinutes) {
    const hours = Math.floor(durationMinutes / 60);
    const quarters = (durationMinutes % 60) / 15;
    return (hours + (quarters / 4)) * this.hour_width;
  }

  timeToCoords(datetime) {
    const time = new Date(datetime);
    return this.left_margin + (time.getHours() * this.hour_width) +
      ((time.getMinutes() / 60) * this.hour_width);
  }

  loadZonesAndTables() {
    this.Zone.getAll(this.current_company_id)
      .then(
        (result) => {
          this.zones = result;
          this.loadTables();
        },
        () => {
        });
  }

  loadGeneralSettings() {
    this.Settings.getGeneralSettings(this.current_company_id)
      .then((generalSettings) => {
        this.general_settings = generalSettings;
        this.reservation_block_width = (this.hour_width / 60) * generalSettings.bezettings_minuten;

        const view = (generalSettings.show_timetable_first ? 'list' : 'calendar');
        this.$rootScope.$broadcast('PageFilterCtrl.change_view', view);
      });
  }

  getTableIdsByTablesList(tablesList) {
    const result = [];
    if (tablesList) {
      tablesList.forEach((table) => {
        result.push(table.id);
      });
    }
    return result;
  }

  getTableNumbersByTableIds(tableIds) {
    const result = [];
    tableIds.forEach((value) => {
      const table = this.filterFilter(this.tables, { id: value });
      if (table) {
        result.push(table[0].table_number);
      }
    }, result);
    return result;
  }

  reservationBlockStyle(tableIndex, item) {
    return {
      left: item.left,
      top: item.top || ((tableIndex * this.top_margin) + this.reservation_height),
      width: item.width || this.reservation_block_width,
    };
  }

  nowLineStyle(zoneId) {
    return {
      height: (this.tables_by_zone[zoneId].length * this.top_margin) + this.reservation_height,
      left: this.now_left_px,
    };
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
