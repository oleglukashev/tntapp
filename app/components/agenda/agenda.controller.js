export default class AgendaCtrl {
  constructor(
    User, Settings, Zone, Table, TimeRange, Product, AgendaItemFactory, PageFilterFactory,
    ReservationStatusMenu, Reservation, ReservationStatus, ReservationPart, filterFilter,
    AppConstants, $scope, $rootScope, $modal, moment, $timeout) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.AppConstants = AppConstants;
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
    this.partsByTable = {};
    this.zones = [];
    this.products = [];
    this.reservations = [];
    this.open_hours = {};

    this.tableOptions = {};

    this.draggableClass = '';
    this.channel = '';

    this.hours = Array.from(Array(24).keys()).map((h) => {
      return (h < 10) ? `0${h.toString()}` : h.toString();
    });

    this.left_margin = 0;
    this.top_margin = 30;
    this.hour_width = 100;
    this.reservation_height = 30;
    this.minimal_width = this.hour_width / 2;
    this.now_left_px = this.left_margin + ((new Date()).getHours() * this.hour_width) +
      (((new Date()).getMinutes() / 60) * this.hour_width);

    this.reservation_block_width = this.hour_width * 1.5;

    $rootScope.$on('ANGULAR_DRAG_START', (obj, event, channel) => {
      this.dragStart(event, channel);
    });

    $rootScope.$on('ANGULAR_DRAG_END', () => {
      this.dragEnd();
    });

    $rootScope.$on('ANGULAR_HOVER', (obj, event) => {
      this.dragHover(obj, event);
    });

    $scope.$on('NewReservationCtrl.reload_reservations', () => {
      this.loadReservations();
    });

    AgendaItemFactory(this);
    PageFilterFactory(this);
    ReservationStatusMenu(this);

    this.loadGeneralSettings();
    this.loadZonesAndTables();
    this.loadProducts();
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

  dragHover(obj, event) {
    const quarter = $(event.target);
    const part = $(this.itemMoveEvent.target);

    // when moving item on other zone
    if (this.itemShadowZone !== quarter.data('zoneId')) {
      this.calendarWrapper = quarter.closest('.calendar_wrapper');
      this.dragStart(this.itemMoveEvent, 'move', this.calendarWrapper);
    }
    const left = ((quarter.data('hour') * this.hour_width) +
      ((quarter.data('quarter') * this.hour_width) / 4)) -
      ((this.offsetHours * this.hour_width) + ((this.offsetQuarters * this.hour_width) / 4));
    const top = quarter.offset().top - this.calendarWrapper.offset().top;

    part.addClass('z-index-1');

    this.itemShadow.css({ left, top });
  }

  dragStart(event, channel, calendarWrapper) {
    if (!this.channel) {
      this.channel = channel;
    }

    if (channel === 'move') {
      const part = $(event.target);

      this.calendarWrapper = calendarWrapper || part.closest('.calendar_wrapper');

      const wrapperScrollX = this.calendarWrapper.scrollLeft() - this.calendarWrapper.offset().left;
      const mouseX = event.originalEvent.pageX;
      const clickedX = wrapperScrollX + mouseX;
      const clickedXPartOffset = Math.floor((
        clickedX - part.position().left) / (this.hour_width / 4));

      if (!calendarWrapper) {
        this.offsetHours = Math.floor(clickedXPartOffset / 4);
        this.offsetQuarters = clickedXPartOffset % 4;
      }

      part.removeClass('z-index-1');

      // creating shadow
      if (this.itemShadow) {
        this.itemShadow.remove();
      }
      this.itemShadow = part.clone().appendTo(this.calendarWrapper);
      this.itemShadow.removeClass('reservation').addClass('reservationShadow');
      this.itemShadowZone = this.calendarWrapper.data('zoneId');
      this.itemMoveEvent = event;

      if (event.target.attributes['data-product-id']) {
        this.draggedProduct = event.target.attributes['data-product-id'].value;
      }
    }

    this.draggableClass = 'dragged';
  }

  dragEnd() {
    const part = $(this.itemMoveEvent.target);
    part.removeClass('z-index-1');
    this.itemShadow.remove();
    this.draggedProduct = 0;
    this.draggableClass = '';
  }

  onDrop(targetTableId, tablePosition, hour, quarter, reservationPartId) {
    const tables = this.partsByTable;
    const dateFilter = this.moment(this.date_filter);

    Object.keys(tables).forEach((tableId) => {
      if (tables[tableId][reservationPartId]) {
        const part = tables[tableId][reservationPartId];
        const dateTime = this.moment(part.date_time);

        if (this.channel === 'resize') {
          const difference = (((hour * 4) + quarter) - ((dateTime.get('hour') * 4) +
            (dateTime.get('minute') / 15)));

          if ((difference * this.hour_width) / 4 > this.minimal_width) {
            const data = {
              part_id: reservationPartId,
              datetime: `${dateFilter.format('YYYY-MM-DD')} ${dateTime.format('HH')}:${dateTime.format('mm')}:00`,
              tables: Object.values(part.table_ids),
              duration_minutes: difference * 15,
            };

            this.ReservationPart.update(this.current_company_id, reservationPartId, data)
              .then(() => {
                part.width = (difference * this.hour_width) / 4;
                this.dragEnd();
              });
          }
        } else if (this.channel === 'move') {
          const fullDateTime = `${dateFilter.format('YYYY-MM-DD')} ${hour}:${(quarter * 15)}:00`;
          const newDateTime = this.moment(fullDateTime).subtract({
            hours: this.offsetHours,
            minutes: this.offsetQuarters * 15,
          });
          const data = {
            part_id: reservationPartId,
            datetime: newDateTime.format('YYYY-MM-DD HH:mm:00'),
            tables: [targetTableId],
          };

          this.ReservationPart.update(this.current_company_id, reservationPartId, data)
            .then((loadedPart) => {
              const newHour = newDateTime.format('HH');
              const newQuarter = Math.floor(newDateTime.format('mm') / 15);
              const left = this.left_margin + (newHour * this.hour_width)
                + ((newQuarter * this.hour_width) / 4);
              const top = this.top_margin + (tablePosition * this.reservation_height);

              part.left = left;
              part.top = top;
              part.date_time = loadedPart.date_time;
              part.table_ids = Object.values(part.table_ids);

              if (!tables[targetTableId]) tables[targetTableId] = {};
              delete tables[tableId][reservationPartId];
              tables[targetTableId][reservationPartId] = part;
            });
        }
      }
    });
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
          datetime.set({ hour, minute: quarter * 15, second: 0 });
          return datetime;
        },
        tableNumber: () => tableNumber,
        tableId: () => tableId,
      },
    });

    modalInstance.result.then(() => {
      this.loadReservations();
    }, () => {
      this.loadReservations();
    });
  }

  getQuarterClass(hour, quarter) {
    const timePart = (hour * 4) + quarter;
    if (this.open_hours[this.draggedProduct] && (
      timePart < this.open_hours[this.draggedProduct].start ||
      timePart > this.open_hours[this.draggedProduct].end
    )) {
      return 'inactive';
    }
    return '';
  }

  loadTables() {
    this.Table.getAll(this.current_company_id)
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
      .then((ranges) => {
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
      .then((result) => {
        this.reservations = this.ReservationStatus.translateAndcheckStatusForDelay(result);

        if (this.tables) {
          this.setGraphData();
          this.setTableOptions();
        }

        this.is_loaded = true;
      });
  }

  loadProducts() {
    this.Product.getAll(this.current_company_id).then(
      (products) => {
        this.products = products;
        this.products.forEach((product) => {
          this.filter_params.push({
            name: 'product',
            value: product.name,
          });
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
          this.zones.forEach((zone) => {
            this.tableOptions[zone.id] = { data: [] };
          });
          this.loadTables();
        },
        () => {},
      );
  }

  loadGeneralSettings() {
    this.Settings.getGeneralSettings(this.current_company_id)
      .then((generalSettings) => {
        this.general_settings = generalSettings;
        this.reservation_block_width = (this.hour_width / 60) * generalSettings.bezettings_minuten;

        const view = (generalSettings.show_timetable_first ? 'list' : 'calendar');
        this.changeView(view);
      });
  }

  getTableIdsByTablesList(list) {
    return list.map(item => item.id);
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

  setGraphData() {
    this.partsByTable = {};
    const reservations = this.applyFilterToReservations();
    reservations.forEach((reservation) => {
      if (reservation.status !== 'cancelled') {
        const parts = reservation.reservation_parts;
        parts.forEach((part) => {
          if (this.moment(this.date_filter).startOf('day')
            .isSame(this.moment(part.date_time).startOf('day'))
          ) {
            part.table_ids.forEach((tableId) => {
              if (!this.partsByTable[tableId]) this.partsByTable[tableId] = {};
              part.left = this.timeToCoords(part.date_time);
              part.width = this.durationToWidth(part.duration_minutes);
              part.customer = reservation.customer;
              part.status = reservation.status;
              part.reservation = reservation;
              this.partsByTable[tableId][part.id] = part;
            });
          }
        });
      }
    });
  }

  getTableOptions(zone) {
    return this.tableOptions[zone.id];
  }

  setTableOptions() {
    this.zones.forEach((zone) => {
      this.tableOptions[zone.id].data = this.getData(zone);
    });
  }

  getData(zone) {
    const result = [];
    const reservations = this.applyFilterToReservations();
    const parts = this.getPartsByReservationsAndZone(reservations, zone);
    parts.forEach((part) => {
      if (this.moment(part.date_time).format('YYYY-MM-DD') ===
        this.moment(this.date_filter).format('YYYY-MM-DD')) {
        result.push(this.rowPart(part));
      }
    });

    return result;
  }

  getPartsByReservationsAndZone(reservations, zone) {
    const result = [];
    const parts = this.ReservationPart.partsByReservations(reservations);

    parts.forEach((part) => {
      part.table_ids.forEach((tableId) => {
        if (zone.table_ids.includes(tableId) && !result.includes(part)) {
          result.push(part);
        }
      });
    });

    return result;
  }
}
