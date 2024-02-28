export default class Controller {
  constructor(Reservation, moment, filterFilter) {
    'ngInject';

    this.Reservation = Reservation;
    this.moment = moment;
    this.filterFilter = filterFilter;

    this.$onChanges = () => {
      this.current_part = this.reservation.reservation_parts[this.currentIndex];
      this.product_week_time_ranges = this.productWeekTimeRanges;
      this.open_time_ranges = this.openTimeRanges;
      this.product_time_ranges = this.productTimeRanges;
      this.current_tab_index = this.currentTabIndex;
    };
  }

  changeProductPostProcess() {
    if (this.includeProductLimits() && this.current_part.product) {
      this.clearAndLoadTime();
      this.selectTab({ index: this.pagination.product });
    }
  }

  includeProductLimits() {
    if (this.current_part.product && this.type === 'customer') {
      const currentPart = this.current_part;
      const currentProduct = this.current_part.product;

      return currentPart.number_of_persons >= currentProduct.min_persons &&
        (!currentProduct.max_persons ||
        currentPart.number_of_persons <= currentProduct.max_persons);
    }

    return true;
  }

  canShowProduct(product) {
    // TODO REFACTOR AFTER NEW RESERVATION REFACTORING
    let result = false;

    if (this.type !== 'customer') {
      return true;
    }

    if (product.shaded) {
      return false;
    }

    const selectedDayOfWeek = this.moment(this.current_part.date).isoWeekday();
    const selectedDate = this.moment(this.current_part.date).format('YYYY-MM-DD');

    if (selectedDayOfWeek) {
      if (product.id === 2509) {
        console.log(selectedDayOfWeek);
        console.log('product_week_time_ranges', this.product_week_time_ranges);
        console.log('open_time_ranges', this.open_time_ranges);
        console.log('product_time_ranges', this.product_time_ranges);
      }

      let productWeekTimeRange = null;
      if (this.product_week_time_ranges[selectedDayOfWeek] &&
        this.product_week_time_ranges[selectedDayOfWeek][product.id]) {
        productWeekTimeRange = this.product_week_time_ranges[selectedDayOfWeek][product.id];
      }

      let openedTimeRange = null;
      if (this.open_time_ranges[selectedDate]) {
        openedTimeRange = this.open_time_ranges[selectedDate];
      }

      let openedProductTimeRange = null;
      if (this.product_time_ranges[selectedDate] &&
        this.product_time_ranges[selectedDate][product.id]) {
        openedProductTimeRange = this.product_time_ranges[selectedDate][product.id];
      }

      if (product) {
        if (productWeekTimeRange) {
          result = productWeekTimeRange.value;
        }

        if (openedProductTimeRange) {
          if (result) {
            result = openedProductTimeRange.value || !openedProductTimeRange.whole_day;
          } else {
            result = openedProductTimeRange.value;
          }
        }

        if (openedTimeRange && result) {
          result = openedTimeRange.value || !openedTimeRange.whole_day;
        }
      }
    }

    return result;
  }

  getProductLimiNotification() {
    if (this.current_part && this.current_part.product) {
      let text = this.warnings.product_limits;
      text = text.replace('%MIN%', this.current_part.product.min_persons);
      return text.replace('%MAX%', this.current_part.product.max_persons);
    }

    return null;
  }

  canShow() {
    return this.current_tab_index === this.pagination.product - 1;
  }
}
