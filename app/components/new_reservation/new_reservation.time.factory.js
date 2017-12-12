export default function NewReservationTimeFactory(moment, filterFilter) {
  'ngInject';

  return (that) => {
    const instance = that;

    instance.changeTimePostProcess = () => {
      instance.selectTab(instance.pagination.time);

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
      const formatedDate = moment(date).format('YYYY-MM-DD');
      const now = moment();

      if (!availableTime.length) return [];

      let currentTimeRange = null;
      if (date && instance.current_part.product) {
        const weekday = instance.moment(date).isoWeekday();
        const timeRange = instance.getProductWeekTimeRange(weekday, instance.current_part.product);
        if (timeRange.value || !timeRange.whole_day) {
          currentTimeRange = timeRange;
        }
      }

      let minProductWeekTime = null;
      let maxProductWeekTime = null;
      if (currentTimeRange) {
        minProductWeekTime = currentTimeRange.start_time;
        maxProductWeekTime = currentTimeRange.end_time;
      }

      const openedTimes = filterFilter(availableTime, { is_open: true });
      const minOpenedTime = openedTimes[0].time;
      const maxOpenedTime = openedTimes[openedTimes.length - 1].time;

      return filterFilter(availableTime, (item) => {
        const defaultCondition = item.time >= minOpenedTime &&
          item.time <= maxOpenedTime &&
          (!item.is_open ? item.time >= minProductWeekTime && item.time <= maxProductWeekTime : true);

        if (!instance.is_customer_reservation) {
          return defaultCondition &&
            moment(`${formatedDate} ${item.time}`) >= now &&
            !item.more_than_deadline
        }

        return defaultCondition;
      });
    };

    instance.timeIsDisabled = (timeObj) => {
      const now = moment();
      const date = instance.current_part.date;
      const formatedDate = moment(date).format('YYYY-MM-DD');

      if (!timeObj.is_open ||
        timeObj.more_than_deadline ||
        moment(`${formatedDate} ${timeObj.time}`) >= now &&
        !instance.isEnoughSeats(timeObj)) {
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

      instance.Table
        .getOccupiedTables(instance.current_company_id,
          { date_time: dateTime, part_id: null },
          instance.is_customer_reservation).then(
          (result) => {
            instance.current_part.occupied_tables = result;
            instance.current_part.occupied_tables_is_loaded = true;
          }, () => {});
    };
  };
}
