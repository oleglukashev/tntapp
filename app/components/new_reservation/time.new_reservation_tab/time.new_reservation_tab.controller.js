export default class Controller {
  constructor(Table, moment, filterFilter, $rootScope) {
    'ngInject';

    this.Table = Table;
    this.moment = moment;
    this.filterFilter = filterFilter;
    this.$rootScope = $rootScope;

    this.$onChanges = () => {
      this.current_part = this.reservation.reservation_parts[this.currentIndex];
      this.current_company_id = this.currentCompanyId;
      this.product_week_time_ranges = this.productWeekTimeRanges;
      this.current_tab_index = this.currentTabIndex;
    };
  }

  changeTimePostProcess() {
    if (this.current_part.time) {
      this.selectTab({ index: this.pagination.time });
    }

    if (this.current_part.time && this.type !== 'customer') {
      this.loadOccupiedTables();
    }
  }

  disabledTimes() {
    const result = [];

    this.openedTimeRangePeriod().forEach((item) => {
      if (this.timeIsDisabled(item)) {
        result.push(item);
      }
    });

    return result;
  }

  getProductWeekTimeRange(weekday, productId) {
    if (this.product_week_time_ranges &&
      this.product_week_time_ranges[weekday] &&
      this.product_week_time_ranges[weekday][productId]) {
      return this.product_week_time_ranges[weekday][productId];
    }

    return null;
  }

  openedTimeRangePeriod() {
    const availableTime = this.current_part.available_time;
    const date = this.current_part.date;
    const product = this.current_part.product;

    if (!date || !product || !availableTime.length) return [];

    let minProductWeekTime = null;
    let maxProductWeekTime = null;
    let minOpenedTime = null;
    let maxOpenedTime = null;

    const weekday = this.moment(date).isoWeekday();
    const timeRange = this.getProductWeekTimeRange(weekday, product.id);
    if (timeRange && (timeRange.value || !timeRange.whole_day)) {
      minProductWeekTime = timeRange.start_time;
      maxProductWeekTime = timeRange.end_time;
    }

    const openedTimes = this.filterFilter(availableTime, { is_open: true });
    if (openedTimes.length) {
      minOpenedTime = openedTimes[0].time;
      maxOpenedTime = openedTimes[openedTimes.length - 1].time;
    } else if (this.type !== 'customer') {
      minOpenedTime = minProductWeekTime;
      maxOpenedTime = maxProductWeekTime;
    }

    return this.filterFilter(availableTime, (item) => {
      const defaultCondition = (item.value ||
                                (item.time >= minProductWeekTime &&
                                item.time <= maxProductWeekTime)) ||
                                (item.time >= minOpenedTime &&
                                item.time <= maxOpenedTime);

      if (this.type === 'customer') {
        return defaultCondition && !item.time_is_past;
      }

      return defaultCondition;
    });
  }

  timeIsDisabled(timeObj) {
    if (!timeObj.is_open || !this.isEnoughSeats(timeObj)) {
      return true;
    }

    const product = this.current_part.product;
    if (product && this.current_part.number_of_persons) {
      if (product.max_person_count &&
          product.max_person_count < this.current_part.number_of_persons) {
        return true;
      }

      if (product.min_person_count &&
          product.min_person_count < this.current_part.number_of_persons) {
        return true;
      }
    } else {
      return true;
    }

    return false;
  }

  isEnoughSeats(timeObj) {
    return (timeObj.available_seats.includes(this.current_part.number_of_persons)) ||
      timeObj.can_overbook;
  }

  loadOccupiedTables() {
    this.current_part.occupied_tables = [];
    const time = this.current_part.time;
    const dateTime = `${this.moment(this.current_part.date).format('DD-MM-YYYY')} ${time}`;
    this.$rootScope.show_spinner = true;

    this.Table.getOccupiedTables(this.current_company_id,
      { datetime: dateTime, part_id: null },
      this.type === 'customer').then(
      (result) => {
        this.$rootScope.show_spinner = false;
        this.current_part.occupied_tables = result;
      }, () => {
        this.$rootScope.show_spinner = false;
      });
  }

  canShow() {
    return this.current_tab_index === this.pagination.time - 1 &&
           this.current_part.available_time_is_loaded;
  }
}
