export default class AgendaCtrl {
  constructor(User, Settings, Zone, Table, TimeRange, Product, ReservationItemFactory,
    PageFilterFactory, PageFilterTimeRange, ReservationStatusMenu, Reservation,
    ReservationStatus, ReservationPart, filterFilter, AppConstants, $scope, $rootScope,
    $modal, moment, $timeout) {
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
    this.graph_data = {};
    this.errors = [];
    this.opened = [true];
    this.zones = {};
    this.products = [];
    this.reservations = [];
    this.time_ranges = [];
    this.open_time_ranges = [];
    this.zone_time_ranges = [];
    this.data = [];
    this.data_without_tables = [];

    this.draggable_class = '';
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

    $rootScope.$on('ANGULAR_HOVER', (obj, event, channel) => {
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

    $scope.$on('reservationStatusChanged', (e, data) => {
      this.changeReservatinItemStatus(data.reservation.id, data.status);
    });

    ReservationItemFactory(this);
    PageFilterFactory(this);
    ReservationStatusMenu(this);

    this.loadGeneralSettings();
    this.loadZonesAndTables();

    this.is_loaded = false;
    this.$rootScope.show_spinner = true;
  }

  changeStatus(reservation, status) {
    this.ReservationStatus
      .changeStatus(this.current_company_id, reservation, status).then(() => {
        this.changeReservatinItemStatus(reservation.id, status);
      });
  }

  changeReservatinItemStatus(reservationId, status) {
    const reservation = this.filterFilter(this.reservations, { id: reservationId })[0];

    if (!reservation) return false;

    reservation.status = status;
    let rowItem = null;

    this.data.forEach((dataItem, index) => {
      if (dataItem.reservation.id === reservationId) {
        this.data.splice(index, 1);

        if (this.cancelFilterIsOn()) {
          rowItem = this.rowPart(dataItem.part, reservation);
          this.data.splice(index, 0, rowItem);
        }
      }
    });

    let tableIds = [];
    reservation.reservation_parts.forEach((part) => {
      tableIds = [...new Set(tableIds.concat(part.table_ids))];
    });

    tableIds.forEach((tableId) => {
      this.graph_data[tableId].forEach((graphItem, index) => {
        if (graphItem.reservation.id === reservationId) {
          this.graph_data[tableId].splice(index, 1);

          if (this.cancelFilterIsOn() && rowItem) {
            const rowGraphItem = this.rowGraphPart(rowItem, tableId);
            this.graph_data[tableId].splice(index, 0, rowGraphItem);
          }
        }
      });
    });

    return false;
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
    $(this.itemMoveEvent.target).addClass('z-index-1');
    if (this.channel === 'resize') return;
    const quarter = $(event.target);

    // when moving item on other zone
    if (quarter.data('zoneId') && this.itemShadowZone !== quarter.data('zoneId')) {
      this.calendarWrapper = quarter.closest('.calendar_wrapper');
      this.dragStart(this.itemMoveEvent, 'move', this.calendarWrapper);
    }

    const left = ((quarter.data('hour') * this.hour_width) +
      ((quarter.data('quarter') * this.hour_width) / 4)) -
      ((this.offsetHours * this.hour_width) + ((this.offsetQuarters * this.hour_width) / 4));
    const top = quarter.offset().top - this.calendarWrapper.offset().top;
    this.itemShadow.css({ left, top, backgroundColor: '#ccc' });
  }

  dragStart(event, channel, calendarWrapper) {
    if (!this.channel) {
      this.channel = channel;
    }

    if (channel === 'move') {
      const part = $(event.target);

      if (this.channel === 'move') {
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

        // creating shadow
        if (this.itemShadow) {
          this.itemShadow.remove();
        }
        this.itemShadow = part.clone().appendTo(this.calendarWrapper);
        this.itemShadow.removeClass('reservation').addClass('reservationShadow');
        this.itemShadowZone = this.calendarWrapper.data('zoneId');
      }

      part.removeClass('z-index-1');
      this.itemMoveEvent = event;

      if (event.target.attributes['data-product-id']) {
        this.draggedProduct = event.target.attributes['data-product-id'].value;
      }
    }

    this.draggable_class = 'dragged';
  }

  dragEnd() {
    const part = $(this.itemMoveEvent.target);
    part.removeClass('z-index-1');

    if (this.itemShadow) {
      this.itemShadow.remove();
    }

    this.draggedProduct = 0;
    this.draggable_class = '';
  }

  onDrop(targetTableId, tablePosition, hour, quarter, dragData) {
    const dateFilter = this.moment(this.date_filter);
    const [graphDataId, oldTableId] = dragData;
    const source = oldTableId ? this.graph_data[oldTableId] : this.data_without_tables;
    const graphItem = this.filterFilter(source, { id: graphDataId })[0];
    const dateTime = this.moment(graphItem.part.date_time);

    if (this.channel === 'resize') {
      const difference = (((hour * 4) + quarter) - ((dateTime.get('hour') * 4) +
        (dateTime.get('minute') / 15)));

      if ((difference * this.hour_width) / 4 > this.minimal_width) {
        const data = {
          part_id: graphItem.id,
          date_time: `${dateFilter.format('YYYY-MM-DD')} ${dateTime.format('HH')}:${dateTime.format('mm')}:00`,
          tables: graphItem.part.table_ids,
          duration_minutes: difference * 15,
        };

        this.ReservationPart.update(this.current_company_id, graphItem.id, data)
          .then((reservationPart) => {
            graphItem.part.duration_minutes = reservationPart.duration_minutes;
            graphItem.width = this.durationToWidth(graphItem.part.duration_minutes);
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

      if (graphItem.part.fromWidget) {
        newDateTime = this.moment(graphItem.part.date_time);
      }

      if (oldTableId !== targetTableId) {
        const oldTableIdIndex = graphItem.part.table_ids.indexOf(oldTableId);

        if (oldTableIdIndex >= 0) {
          graphItem.part.table_ids.splice(oldTableIdIndex, 1);
        }

        graphItem.part.table_ids.push(targetTableId);
      }

      const data = {
        part_id: graphItem.id,
        date_time: newDateTime.format('YYYY-MM-DD HH:mm:00'),
        tables: graphItem.part.table_ids,
      };

      this.ReservationPart.update(this.current_company_id, graphItem.id, data)
        .then((loadedPart) => {
          const newHour = newDateTime.format('HH');
          const newQuarter = Math.floor(newDateTime.format('mm') / 15);
          const left = this.left_margin + (newHour * this.hour_width)
            + ((newQuarter * this.hour_width) / 4);
          const top = this.top_margin + (tablePosition * this.reservation_height);

          graphItem.left = left;
          graphItem.top = top;
          graphItem.part.date_time = loadedPart.date_time;
          graphItem.part.table_ids = Object.values(graphItem.part.table_ids);
          graphItem.part.fromWidget = false;

          this.setData();
        });
    }

    this.channel = '';
  }

  filterDataForGraph(zoneId, tableId) {
    return this.data.filter(item => item.source_table_ids.includes(tableId));
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

  getTableIdsByTablesList(list) {
    return list.map(item => item.id);
  }

  reservationBlockStyle(tableIndex, tableId, item) {
    const styles = {
      left: item.left,
      top: item.top || ((tableIndex * this.top_margin) + this.reservation_height),
      width: item.width || this.reservation_block_width,
    };

    if (this.graph_data[tableId]) {
      this.graph_data[tableId].forEach((graphItem) => {
        const graphItemRight = graphItem.left + graphItem.width;
        const itemRight = item.left + item.width;

        if (item.id !== graphItem.id &&
          ((graphItem.left < item.left && graphItemRight > item.left) ||
          (graphItem.left < itemRight && graphItemRight > itemRight))) {
          styles.backgroundColor = '#e57373';
          styles.color = '#fff';
        }
      });
    }

    return styles;
  }

  nowLineStyle(zoneId) {
    if (!this.zones[zoneId]) return null;

    return {
      height: (this.zones[zoneId].table_ids.length * this.top_margin) + this.reservation_height,
      left: this.now_left_px + this.hour_width,
    };
  }

  getEmptyTableReservations() {
    return this.data_without_tables.length;
  }

  setData() {
    this.data = [];
    this.graph_data = {};
    this.data_without_tables = [];
    const reservations = this.applyFilterToReservations();

    reservations.forEach((reservation) => {
      reservation.reservation_parts.forEach((part) => {
        if ((this.moment(part.date_time).format('YYYY-MM-DD') ===
            this.moment(this.date_filter).format('YYYY-MM-DD'))) {
          // list
          const rowItem = this.rowPart(part, reservation);
          this.data.push(rowItem);

          // calendar
          if (part.table_ids.length) {
            part.table_ids.forEach((tableId) => {
              const rowGraphItem = this.rowGraphPart(rowItem, tableId);
              this.graph_data[tableId].push(rowGraphItem);
            });
          } else {
            part.fromWidget = true;

            // widget
            this.data_without_tables.push(rowItem);
          }
        }
      });
    });

    this.data = this.applySort(this.data);
    this.calculateTotalsForPrint();

    this.$rootScope.$broadcast('agenda.load_reservations_data_and_date_filter',
      { reservations_data: this.data, date: this.date_filter });
  }

  rowGraphPart(rowItem, tableId) {
    let tableIndex = -1;
    if (!this.graph_data[tableId]) {
      this.graph_data[tableId] = [];
    }

    Object.keys(this.zones).forEach((zoneId) => {
      const indexOf = this.zones[zoneId].table_ids.indexOf(tableId);
      if (indexOf >= 0) {
        tableIndex = indexOf;
      }
    });

    return {
      id: rowItem.part.id,
      name: rowItem.name,
      customer: rowItem.reservation.customer,
      status: rowItem.reservation.status,
      reservation: rowItem.reservation,
      part: rowItem.part,
      number_of_persons: rowItem.part.number_of_persons,
      product_name: rowItem.product_name,
      left: this.timeToCoords(rowItem.part.date_time),
      top: this.top_margin + (tableIndex * this.reservation_height),
      width: this.durationToWidth(rowItem.part.duration_minutes) || this.reservation_block_width,
    };
  }

  calculateTotalsForPrint() {
    const dataReservationIds = this.data.map(dataItem => dataItem.reservation_id);
    this.totalNumberOfReservations = dataReservationIds
      .filter((value, index) => dataReservationIds.indexOf(value) === index).length;

    this.totalNumberOfPersons = 0;
    this.data.forEach((item) => {
      this.totalNumberOfPersons += parseInt(item.number_of_persons, 10);
    });
  }

  changeSortPostProcess() {
    this.data = this.applySort(this.data);
  }

  getZoneNameByRange(timeRange) {
    if (!timeRange.zone) return null;
    return this.zones[timeRange.zone.id].name;
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

  loadTables() {
    this.Table.getAll(this.current_company_id)
      .then(
        (tables) => {
          this.is_loaded = true;
          this.$rootScope.show_spinner = false;

          this.tables = {};
          tables.forEach((table) => {
            this.tables[table.id] = table;
          });
          this.loadReservations();
          this.iniAndScrolltToNowLine();
          this.loadProducts();
          this.loadTimeRanges();
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

  loadReservations() {
    this.reservations = [];
    const date = this.moment(this.date_filter).format('YYYY-MM-DD');
    this.Reservation.getAll(this.current_company_id, date)
      .then((result) => {
        this.$rootScope.show_spinner = false;
        this.reservations = result;

        if (this.tables) {
          this.setData();
        }
      });
  }

  loadProducts() {
    this.Product.getAll(this.current_company_id).then(
      (products) => {
        this.products = products;
        this.products.forEach((product) => {
          const productFilterParams = {
            name: 'product',
            value: product.name,
          };

          this.product_filter_params.push(productFilterParams);
          this.product_filter.push(productFilterParams);
        });
      });
  }

  loadZonesAndTables() {
    this.Zone.getAll(this.current_company_id)
      .then(
        (zones) => {
          this.zones = {};
          zones.forEach((zone) => {
            this.zones[zone.id] = zone;
          });
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
}
