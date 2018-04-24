export default function NewReservationProductFactory(moment, filterFilter) {
  'ngInject';

  return (that) => {
    const instance = that;

    instance.changeProductPostProcess = () => {
      instance.current_part.current_product = null;


      if (instance.current_part.product) {
        const product = filterFilter(instance.products, { id: instance.current_part.product })[0];
        instance.current_part.current_product = product;
      }

      if (instance.includeProductLimits() && instance.current_part.product) {
        instance.clearAndLoadTime();
        instance.selectTab(instance.pagination.product);
      }
    };

    instance.includeProductLimits = () => {
      if (instance.current_part.current_product) {
        const currentPart = instance.current_part;
        const currentProduct = instance.current_part.current_product;

        return currentPart.number_of_persons >= currentProduct.min_persons &&
          (!currentProduct.max_persons ||
          currentPart.number_of_persons <= currentProduct.max_persons);
      }

      return true;
    };

    instance.checkProductForTimeRange = (productId) => {
      const selectedDayOfWeek = moment(instance.current_part.date).isoWeekday();

      if (selectedDayOfWeek) {
        const isProductEnabledForSelectedDay = instance.time_ranges[selectedDayOfWeek][productId];

        return selectedDayOfWeek &&
          isProductEnabledForSelectedDay &&
          isProductEnabledForSelectedDay.value;
      }

      return false;
    };

    instance.canShowProduct = (product) => {
      // TODO REFACTOR AFTER NEW RESERVATION REFACTORING
      let result = false;

      if (!instance.is_customer_reservation) {
        return true;
      }

      if (product.shaded) {
        return false;
      }

      const selectedDayOfWeek = moment(instance.current_part.date).isoWeekday();
      const selectedDate = moment(instance.current_part.date).format('YYYY-MM-DD');

      if (selectedDayOfWeek) {
        let productWeekTimeRange = null;
        if (instance.product_week_time_ranges[selectedDayOfWeek] &&
          instance.product_week_time_ranges[selectedDayOfWeek][product.id]) {
          productWeekTimeRange = instance.product_week_time_ranges[selectedDayOfWeek][product.id];
        }

        let openedTimeRange = null;
        if (instance.open_time_ranges[selectedDate]) {
          openedTimeRange = instance.open_time_ranges[selectedDate];
        }

        let openedProductTimeRange = null;
        if (instance.product_time_ranges[selectedDate] &&
          instance.product_time_ranges[selectedDate][product.id]) {
          openedProductTimeRange = instance.product_time_ranges[selectedDate][product.id];
        }

        if (product) {
          if (productWeekTimeRange) {
            result = productWeekTimeRange.value;
          }

          if (openedTimeRange) {
            result = openedTimeRange.value || !openedTimeRange.whole_day;
          }

          if (openedProductTimeRange) {
            result = openedProductTimeRange.value || !openedProductTimeRange.whole_day;
          }
        }
      }

      return result;
    };
  };
}
