import angular from 'angular';

export default function NewReservationDateFactory(moment, filterFilter, $mdDialog, $q) {
  'ngInject';

  return (that, $scope) => {
    const instance = that;

    instance.dateDisableDeferred = $q.defer();
    $scope.dateDisablePromise = instance.dateDisableDeferred.promise;

    instance.changeDatePostProcess = () => {
      instance.current_part.number_of_persons = null;
      instance.current_part.product = null;
      instance.current_part.time = null;
      instance.selectTab(instance.pagination.date);
    };

    instance.disableDates = (date) => {
      // TODO REFACTOR AFTER NEW RESERVATION REFACTORING
      if (!instance.is_customer_reservation) {
        return false;
      }

      let result = true;

      console.log(date);

      const disabledProductsData = instance.disabledProductsData(date);
      const disabledZonesData = instance.disabledZonesData(date);

      Object.keys(disabledProductsData).forEach((productId) => {
        if (!disabledProductsData[productId]) {
          result = false;
        }
      });

      if (!Object.values(disabledZonesData).includes(false)) {
        result = true;
      }

      console.log('-- TOTAL --');
      console.log(`disabled: ${result}`);

      return result;
    };

    instance.disabledProductsData = (date) => {
      const dateFormat = moment(date).format('YYYY-MM-DD');
      const dateWeekDay = moment(date).isoWeekday();
      const data = {};

      instance.products.forEach((product) => {
        data[product.id] = true;

        if (instance.product_week_time_ranges[dateWeekDay] &&
          instance.product_week_time_ranges[dateWeekDay][product.id]) {
          const timeRange = instance.product_week_time_ranges[dateWeekDay][product.id];
          data[product.id] = !timeRange.value;

          console.log('-- product week time range --');
          console.log(`disabled: ${data[product.id]}`);
          console.log(timeRange);
        }

        if (instance.open_time_ranges[dateFormat]) {
          const timeRange = instance.open_time_ranges[dateFormat];

          if (timeRange.value) {
            data[product.id] = false;
          } else if (!timeRange.value && timeRange.whole_day) {
            data[product.id] = true;
          }

          console.log('-- open time range --');
          console.log(`disabled: ${data[product.id]}`);
          console.log(timeRange);
        }

        if (instance.product_time_ranges[dateFormat] &&
          instance.product_time_ranges[dateFormat][product.id]) {
          const timeRange = instance.product_time_ranges[dateFormat][product.id];

          if (timeRange.value) {
            data[product.id] = false;
          } else if (!timeRange.value && timeRange.whole_day) {
            data[product.id] = true;
          }

          console.log('-- product --');
          console.log(`disabled: ${data[product.id]}`);
          console.log(timeRange);
        }

        if (product.shaded) {
          data[product.id] = true;
        }
      });

      return data;
    };

    instance.disabledZonesData = (date) => {
      const dateFormat = moment(date).format('YYYY-MM-DD');
      const data = {};

      instance.zones.forEach((zone) => {
        data[zone.id] = false;

        if (instance.zone_time_ranges[dateFormat] &&
          instance.zone_time_ranges[dateFormat][zone.id]) {
          const timeRange = instance.zone_time_ranges[dateFormat][zone.id];

          if (!timeRange.value && timeRange.whole_day) {
            data[zone.id] = true;
            console.log('-- zone time range --');
            console.log(`disabled: ${data[zone.id]}`);
            console.log(timeRange);
          }
        }
      });

      return data;
    };

    instance.checkDeadlineAndClosedDate = () => {
      if (instance.is_customer_reservation &&
        instance.settings &&
        instance.settings.reservation_deadline) {
        const now = moment();
        const selectedDate = moment(instance.current_part.date).format('YYYY-MM-DD');
        const selectedDateTime = moment(now.format('HH:mm'), 'HH:mm');

        const deadline = moment(instance.settings.reservation_deadline, 'HH:mm');
        const moreThanDeadline = selectedDate === now.format('YYYY-MM-DD') && selectedDateTime > deadline;

        if (moreThanDeadline) {
          instance.selected_index = 1;
          instance.current_part.date = null;
          $mdDialog.show($mdDialog.alert()
            .parent(angular.element(document.querySelector('.modal-dialog')))
            .clickOutsideToClose(true)
            .textContent('Vandaag nemen wij online geen reserveringen meer aan. Neem telefonisch contact met ons op')
            .ok('Terug'));
        }
      }
    };

    instance.refreshDatepicker = () => {
      instance.dateDisableDeferred.notify(new Date().getTime());
    };
  };
}
