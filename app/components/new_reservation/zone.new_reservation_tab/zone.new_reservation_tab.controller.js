export default class Controller {
  constructor($auth, filterFilter, moment) {
    'ngInject';

    this.moment = moment;
    this.filterFilter = filterFilter;
    this.$auth = $auth;

    this.$onChanges = () => {
      this.current_part = this.reservation.reservation_parts[this.currentIndex];
      this.current_tab_index = this.currentTabIndex;
      this.zone_time_ranges = this.zoneTimeRanges;
      this.selected_zone = this.selectedZone;
    };
  }

  setZone(zone) {
    this.selected_zone = zone;
    this.current_part.zone = zone;
  }

  changeTableValuesPostProcess() {
    this.current_part.tables = [];

    Object.keys(this.current_part.tables_values).forEach((key) => {
      if (this.current_part.tables_values[key]) {
        const table = this.tables.filter(item => item.id === parseInt(key))[0];
        this.current_part.tables.push(table);
      }
    });
  }

  isDisabledTable(tableId, zoneId) {
    const currentDate = this.current_part.date;
    const currentOccupiedTables = this.current_part.occupied_tables;
    if (currentOccupiedTables && typeof currentOccupiedTables[parseInt(tableId)] !== 'undefined') {
      return true;
    }

    if (currentDate && zoneId) {
      const date = this.moment(currentDate).format('YYYY-MM-DD');

      if (this.zone_time_ranges[date] && this.zone_time_ranges[date][zoneId]) {
        const timeRange = this.zone_time_ranges[date][zoneId];

        if (timeRange.whole_day) {
          return !timeRange.value;
        } else if (this.current_part.time && !timeRange.value) {
          return this.current_part.time >= timeRange.start_time &&
            this.current_part.time <= timeRange.end_time;
        }
      }
    }

    return false;
  }

  classOfTable(tableId, zoneId) {
    return this.isDisabledTable(tableId, zoneId) ? 'red-300' : 'btn-default text-success';
  }

  changeSelectAllTablesProcess() {
    if (this.current_part.all_tables_selected[this.current_part.zone.id]) {
      if (!this.current_part.tables_values) {
        this.current_part.tables_values = {};
      }

      this.current_part.zone.tables.forEach((table) => {
        this.current_part.tables_values[table.id] = true;
      });
    } else {
      this.current_part.zone.tables.forEach((table) => {
        delete this.current_part.tables_values[table.id];
      });
    }

    this.changeTableValuesPostProcess();
  }

  canShow() {
    return this.current_tab_index === this.pagination.zone - 1;
  }
}
