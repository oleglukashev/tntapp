export default function NewReservationTimeFactory(moment, filterFilter) {
  'ngInject';

  return (that) => {
    const instance = that;

    instance.changeTimePostProcess = () => {
      if (instance.current_part.time) {
        instance.selectTab(instance.pagination.time);
      }

      if (instance.current_part.time && !instance.is_customer_reservation) {
        instance.loadOccupiedTables();
      }
    };

    instance.disabledTimes = () => {
      const result = [];

      instance.openedTimeRangePeriod().forEach((item) => {
        if (instance.timeIsDisabled(item)) {
          result.push(item);
        }
      });

      return result;
    };

    instance.openedTimeRangePeriod = () => {
      const availableTime = instance.current_part.available_time;
      const date = instance.current_part.date;
      const product = instance.current_part.product;

      if (!date || !product || !availableTime.length) return [];

      let minProductWeekTime = null;
      let maxProductWeekTime = null;
      let minOpenedTime = null;
      let maxOpenedTime = null;

      const weekday = instance.moment(date).isoWeekday();
      const timeRange = instance.getProductWeekTimeRange(weekday, instance.current_part.product);
      if (timeRange && (timeRange.value || !timeRange.whole_day)) {
        minProductWeekTime = timeRange.start_time;
        maxProductWeekTime = timeRange.end_time;
      }

      const openedTimes = filterFilter(availableTime, { is_open: true });
      if (openedTimes.length) {
        minOpenedTime = openedTimes[0].time;
        maxOpenedTime = openedTimes[openedTimes.length - 1].time;
      } else if (!instance.is_customer_reservation) {
        minOpenedTime = minProductWeekTime;
        maxOpenedTime = maxProductWeekTime;
      }

      return filterFilter(availableTime, (item) => {
        const defaultCondition = (item.value ||
                                  (item.time >= minProductWeekTime &&
                                  item.time <= maxProductWeekTime)) ||
                                  (item.time >= minOpenedTime &&
                                  item.time <= maxOpenedTime);

        if (instance.is_customer_reservation) {
          return defaultCondition && !item.time_is_past;
        }

        return defaultCondition;
      });
    };

    instance.timeIsDisabled = (timeObj) => {
      if (!timeObj.is_open || !instance.isEnoughSeats(timeObj) || timeObj.available_table_count <= 0) {
        return true;
      }

      const product = instance.current_part.current_product;
      if (product && instance.current_part.number_of_persons) {
        if (product.max_person_count &&
            product.max_person_count < instance.current_part.number_of_persons) {
          return true;
        }

        if (product.min_person_count &&
            product.min_person_count < instance.current_part.number_of_persons) {
          return true;
        }
      } else {
        return true;
      }

      return false;
    };

    instance.isEnoughSeats = timeObj =>
      (instance.current_part.number_of_persons <= timeObj.max_personen_voor_tafels &&
      instance.current_part.number_of_persons <= timeObj.available_seat_count) ||
      timeObj.can_overbook;

    instance.loadOccupiedTables = () => {
      instance.current_part.occupied_tables = [];
      instance.current_part.occupied_tables_is_loaded = false;
      const time = instance.current_part.time;
      const dateTime = `${moment(instance.current_part.date).format('DD-MM-YYYY')} ${time}`;
      instance.$rootScope.show_spinner = true;

      instance.Table
        .getOccupiedTables(instance.current_company_id,
          { date_time: dateTime, part_id: null },
          instance.is_customer_reservation).then(
          (result) => {
            instance.$rootScope.show_spinner = false;
            instance.current_part.occupied_tables = result;
            instance.current_part.occupied_tables_is_loaded = true;
          }, () => {
            instance.$rootScope.show_spinner = false;
          });
    };
  };
}
