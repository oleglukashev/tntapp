export default class AgendaCtrl {
  constructor(
    User, Settings, Zone, Table, TimeRange, Product, AgendaItemFactory, PageFilterFactory, PageFilterTimeRange,
    ReservationStatusMenu, Reservation, ReservationStatus, ReservationPart, filterFilter, AppConstants, $scope,
    $rootScope, $modal, moment, $timeout) {
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
    this.PageFilterTimeRange = PageFilterTimeRange;
    this.filterFilter = filterFilter;
    this.moment = moment;
    this.$modal = $modal;
    this.$timeout = $timeout;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.tables_by_zone = {};
    this.errors = [];
    this.opened = [true];
    this.is_loaded = false;
    this.zones = [];
    this.products = [];
    this.reservations = [];
    this.time_ranges = [];
    this.open_time_ranges = [];
    this.zone_time_ranges = [];
    this.data = [];
    this.data_without_tables = [];

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
      ((((new Date()).getMinutes() / 60) * this.hour_width) - this.hour_width);

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

    $scope.$on('AgendaCtrl.reload_time_ranges', () => {
      this.loadTimeRanges();
    });

    $scope.$on('$viewContentLoaded', () => {
      this.scrollToNow();
    });

    AgendaItemFactory(this);
    PageFilterFactory(this);
    ReservationStatusMenu(this);

    this.loadGeneralSettings();
    this.loadZonesAndTables();
    this.loadProducts();
    this.loadTimeRanges();
  }

  dontHideWidget($event) {
    $event.stopImmediatePropagation();
  }

  // scrolling left for now line
  scrollToNow(index) {
    if (this.is_today) {
      const eq = index === undefined ? '' : `:eq(${index})`;
      this.$timeout(() => {
        $(`.calendar_wrapper${eq}`).animate({ scrollLeft: this.now_left_px }, 'slow');
      }, 1500);
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

  onDrop(targetTableId, tablePosition, hour, quarter, dragData) {
    const dateFilter = this.moment(this.date_filter);
    const [partId, reservationId] = dragData;

    const reservation = this.filterFilter(this.reservations, { id: reservationId })[0];
    const part = this.filterFilter(reservation.reservation_parts, { id: partId })[0];

    const dateTime = this.moment(part.date_time);

    if (this.channel === 'resize') {
      const difference = (((hour * 4) + quarter) - ((dateTime.get('hour') * 4) +
        (dateTime.get('minute') / 15)));

      if ((difference * this.hour_width) / 4 > this.minimal_width) {
        const data = {
          part_id: partId,
          date_time: `${dateFilter.format('YYYY-MM-DD')} ${dateTime.format('HH')}:${dateTime.format('mm')}:00`,
          tables: Object.values(part.table_ids),
          duration_minutes: difference * 15,
        };

        this.ReservationPart.update(this.current_company_id, partId, data)
          .then(() => {
            part.width = (difference * this.hour_width) / 4;
            this.dragEnd();
            this.setData();
          });
      }
    } else if (this.channel === 'move') {
      let minutes = quarter * 15;
      minutes = minutes ? String(minutes) : '00';

      const fullDateTime = `${dateFilter.format('YYYY-MM-DD')} ${hour}:${minutes}:00`;
      let newDateTime = this.moment(fullDateTime).subtract({
        hours: this.offsetHours,
        minutes: this.offsetQuarters * 15,
      });

      if (part.fromWidget) {
        newDateTime = this.moment(part.date_time);
      }

      const data = {
        part_id: partId,
        date_time: newDateTime.format('YYYY-MM-DD HH:mm:00'),
        tables: [targetTableId],
      };

      this.ReservationPart.update(this.current_company_id, partId, data)
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
          part.fromWidget = false;

          const changedReservation = this.filterFilter(this.reservations, { id: part.reservation.id })[0];
          const changedPart = this.filterFilter(changedReservation.reservation_parts, { id: partId })[0];
          changedPart.table_ids = Object.values(loadedPart.table_ids);
          this.setData();
        });
    }

    this.channel = '';
  }

  filterDataForGraph(zoneId, tableId) {
    return this.filterFilter(this.data, { source_table_ids: tableId });
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

  // isHover(hover, hour, quarter) {
  //   const timePart = (hour * 4) + quarter;

  //   return (hover || (this.open_hours[this.draggedProduct] &&
  //     (timePart < this.open_hours[this.draggedProduct].start ||
  //     timePart > this.open_hours[this.draggedProduct].end)));
  // }

  isClosedTime(hour, quarter, zoneId) {
    let result = false;
    const minutes = quarter * 15;
    const time = `${hour}:${minutes}`;

    const lastOpenTimeRange = this.open_time_ranges[this.open_time_ranges.length - 1];
    if (lastOpenTimeRange && !lastOpenTimeRange.value) {
      if (lastOpenTimeRange.whole_day) {
        result = true;
      } else {
        if (time >= lastOpenTimeRange.start_time && time <= lastOpenTimeRange.end_time) {
          result = true;
        }
      }
    }

    const zonesTimeRangesByZone = this.zone_time_ranges[zoneId];
    if (zonesTimeRangesByZone) {
      const lastZoneTimeRange = zonesTimeRangesByZone[zonesTimeRangesByZone.length - 1];
      if (lastZoneTimeRange && !lastZoneTimeRange.value) {
        if (lastZoneTimeRange.whole_day) {
          result = true;
        } else {
          if (time >= lastZoneTimeRange.start_time && time <= lastZoneTimeRange.end_time) {
            result = true;
          }
        }
      }
    }

    return result;
  }

  loadTables() {
    this.Table.getAll(this.current_company_id)
      .then(
        (tables) => {
          this.tables = tables;

          this.zones.forEach((zone) => {
            this.tables_by_zone[zone.id] = this.filterFilter(tables, { zones: zone.id })
              .map((item) => {
                return {
                  id: item.id,
                  table_number: item.table_number,
                  number_of_persons: parseInt(item.number_of_persons, 10),
                  position: parseInt(item.position, 10),
                  zones: item.zones,
                };
              });
          });
          this.loadReservations();
          this.iniAndScrolltToNowLine();
          this.is_loaded = true;
        });
  }

  loadTimeRanges() {
    const date = this.moment(this.date_filter).format('YYYY-MM-DD');
    this.time_ranges = [];
    this.open_time_ranges = [];
    this.zone_time_ranges = [];
    this.TimeRange.getAll(this.current_company_id, date)
      .then((timeRanges) => {
        this.time_ranges = timeRanges;
        this.open_time_ranges = timeRanges.filter(item => item.type === 'open' && item.fixed_date);

        const zoneTimeRanges = timeRanges
          .filter(item => item.type === 'zone' && item.fixed_date && item.zone);
        zoneTimeRanges.forEach((item) => {
          if (!this.zone_time_ranges[item.zone.id]) {
            this.zone_time_ranges[item.zone.id] = [];
          }

          this.zone_time_ranges[item.zone.id].push(item);
        });

        this.time_ranges_is_loaded = true;
      });
  }

  // loadOpenHoursTimeRanges() {
  //   const date = this.moment(this.date_filter).format('YYYY-MM-DD');
  //   this.PageFilterTimeRange
  //     .getAll(this.current_company_id, date, 'open')
  //     .then(
  //       (openTimeRanges) => {
  //         this.today_open_time_ranges = openTimeRanges;
  //       }, () => {});
  // }

  loadReservations() {
    this.reservations = [];
    const date = this.moment(this.date_filter).format('YYYY-MM-DD');
    this.Reservation.getAll(this.current_company_id, date)
      .then((result) => {
        this.reservations = result;

        if (this.tables) {
          this.setData();
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
    const time = this.moment(datetime);
    return this.left_margin + (time.hours() * this.hour_width) +
      ((time.minutes() / 60) * this.hour_width);
  }

  loadZonesAndTables() {
    this.Zone.getAll(this.current_company_id)
      .then(
        (result) => {
          this.zones = result;
          this.loadTables();
        }, () => {});
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
      left: this.now_left_px + this.hour_width,
    };
  }

  getEmptyTableReservations() {
    return this.data_without_tables.length;
  }

  setGraphData() {
    const reservations = this.applyFilterToReservations();
    reservations.forEach((reservation) => {
      if (reservation.status !== 'cancelled') {
        reservation.reservation_parts.forEach((part) => {
          const tmpReserv = this.filterFilter(this.reservations, { id: reservation.id })[0];
          const procPart = this.filterFilter(tmpReserv.reservation_parts, { id: part.id })[0];

          procPart.customer = reservation.customer;
          procPart.status = reservation.status;
          procPart.reservation = reservation;
          if (procPart.table_ids.length) {
            procPart.left = this.timeToCoords(part.date_time);
            procPart.width = this.durationToWidth(part.duration_minutes);
          } else {
            procPart.fromWidget = true;
          }
        });
      }
    });
  }

  setData() {
    this.data = this.getData();

    this.setGraphData();
    this.setWidgetData();
  }

  setWidgetData() {
    const result = [];
    const reservations = this.applyFilterToReservations();

    reservations.forEach((reservation) => {
      if (reservation.status !== 'cancelled') {
        reservation.reservation_parts.forEach((part) => {
          if (!part.table_ids.length) {
            result.push(this.rowPart(part, reservation));
          }
        });
      }
    });

    this.data_without_tables = result;
  }

  getData() {
    const result = [];
    const reservations = this.applyFilterToReservations();

    reservations.forEach((reservation) => {
      if (reservation.status !== 'cancelled') {
        reservation.reservation_parts.forEach((part) => {
          if ((this.moment(part.date_time).format('YYYY-MM-DD') ===
              this.moment(this.date_filter).format('YYYY-MM-DD'))) {
            result.push(this.rowPart(part, reservation));
          }
        });
      }
    });

    return this.applySort(result);
  }

  getZoneNameByRange(timeRange) {
    if (!timeRange.zone) return null;
    const zones = this.filterFilter(this.zones, { id: timeRange.zone.id });
    return zones && zones.length ? zones[0].name : null;
  }

  getProductsName(timeRange) {
    if (timeRange.products) {
      const products = this.products.filter(item => timeRange.products.includes(item.id));
      return products && products.length ? products.map(item => item.name).join(', ') : null;
    } else if (timeRange.product) {
      const products = this.filterFilter(this.products, { id: timeRange.product.id });
      return products && products.length ? products[0].name : null;
    }

    return null;
  }

  iniAndScrolltToNowLine() {
    this.is_today = false;
    if (this.moment().format('YYYY-MM-DD') ===
        this.moment(this.date_filter).format('YYYY-MM-DD')) {
      this.is_today = true;
      this.scrollToNow();
    }
  }
}
