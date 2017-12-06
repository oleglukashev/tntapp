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
      if (!availableTime.length) return [];

      const date = instance.current_part.date;
      const openedTimes = filterFilter(availableTime, { is_open: true });

      if (openedTimes.length > 0) {
        const min = openedTimes[0].time;
        const max = openedTimes[openedTimes.length - 1].time;
        const now = moment();
        const formatedDate = moment(date).format('YYYY-MM-DD');

        return filterFilter(openedTimes, item => item.time >= min &&
          item.time <= max &&
          moment(`${formatedDate} ${item.time}`) >= now &&
          (instance.is_customer_reservation ? !item.more_than_deadline : true));
      }

      return [];
    };

    instance.timeIsDisabled = (timeObj) => {
      if (!timeObj.is_open || !instance.isEnoughSeats(timeObj)) {
        return true;
      }

      if (instance.current_product) {
        const reservationDateStr = moment(instance.reservation.date).format('YYYY-MM-DD');
        const objTime = moment(`${reservationDateStr} ${timeObj.time}`);
        const startProductTime = moment(`${reservationDateStr} ${instance.current_product.start_time}`);
        const endProductTime = moment(`${reservationDateStr} ${instance.current_product.end_time}`);

        if (objTime <= endProductTime &&
            objTime >= startProductTime &&
            instance.current_product.max_person_count &&
            ((instance.current_product.max_person_count < instance.current_part.number_of_persons) ||
            instance.current_product.min_person_count > instance.current_part.number_of_persons)) {
          return true;
        }
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
