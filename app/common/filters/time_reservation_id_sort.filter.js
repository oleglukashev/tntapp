import angular from 'angular';

export default angular.module('app.filters', [])
  .filter('orderByTimeAndRestaurantId', () =>
    (items) => {
      const partsByReservation = {};
      const result = [];

      items.sort((a, b) => {
        if (a.reservation_id > b.reservation_id) {
          return 1;
        } else if (a.reservation_id < b.reservation_id) {
          return -1;
        }

        return 0;
      });

      items.forEach((item) => {
        if (!partsByReservation[item.reservation_id]) {
          partsByReservation[item.reservation_id] = [];
        }

        partsByReservation[item.reservation_id].push(item);
      });

      items.sort((a, b) => {
        if (a.time > b.time) {
          return 1;
        } else if (a.time < b.time) {
          return -1;
        }

        return 0;
      });

      const existReservations = [];
      items.forEach((item) => {
        if (!existReservations.includes(item.reservation_id)) {
          partsByReservation[item.reservation_id].forEach((part) => {
            result.push(part);
            if (!existReservations.includes(part.reservation_id)) {
              existReservations.push(part.reservation_id);
            }
          });
        }
      });

      return result;
    })
  .name;
