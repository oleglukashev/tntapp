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
      let result = true;
      const dateFormat = moment(date).format('YYYY-MM-DD');
      const dateWeekDay = moment(date).isoWeekday();
      const showedProducts = filterFilter(instance.products, { shaded: false });
      let closedProductTimeRangesIds = [];

      if (!instance.is_customer_reservation) {
        return false;
      }

      if (!showedProducts.length) {
        return true
      }


      if (instance.product_week_time_ranges[dateWeekDay]) {
        const productIds = Object.keys(instance.product_week_time_ranges[dateWeekDay]);
        productIds.forEach((productId) => {
          const timeRange = instance.product_week_time_ranges[dateWeekDay][productId];
          result = !timeRange.value;

          if (!timeRange.value && !closedProductTimeRangesIds.includes(parseInt(productId))) {
            closedProductTimeRangesIds.push(parseInt(productId));
          }
        });
      }

      if (instance.open_time_ranges[dateFormat]) {
        const timeRange = instance.open_time_ranges[dateFormat];

        if (timeRange.value) {
          result = false;
        } else if (!timeRange.value && timeRange.whole_day) {
          result = true;
        }
      }

      if (instance.product_time_ranges[dateFormat]) {
        const productIds = Object.keys(instance.product_time_ranges[dateFormat]);
        productIds.forEach((productId) => {
          const product = filterFilter(instance.products, { id: productId })[0];
          const timeRange = instance.product_time_ranges[dateFormat][productId];

          if (!product || product.shaded) {
            result = true;
            if (!closedProductTimeRangesIds.includes(parseInt(productId))) {
              closedProductTimeRangesIds.push(parseInt(productId));
            }
          } else {
            if (timeRange.value) {
              result = false;
            } else if (!timeRange.value && timeRange.whole_day) {
              result = true;
              if (!closedProductTimeRangesIds.includes(parseInt(productId))) {
                closedProductTimeRangesIds.push(parseInt(productId));
              }
            }
          }
        });
      }

      const productIds = instance.products.map(product => product.id).sort();
      closedProductTimeRangesIds = closedProductTimeRangesIds.sort();

      if (angular.equals(productIds, closedProductTimeRangesIds)) {
        return true;
      }

      if (instance.zone_time_ranges[dateFormat]) {
        const zonesIds = instance.zones.map(zone => zone.id);
        const closedZoneTimeRangesIds = [];
        const zoneTimeRanges = instance.zone_time_ranges[dateFormat];

        Object.keys(zoneTimeRanges).forEach((key) => {
          const timeRange = zoneTimeRanges[key];
          if (!timeRange.value && timeRange.whole_day) {
            closedZoneTimeRangesIds.push(parseInt(key));
          }
        });

        if (angular.equals(zonesIds, closedZoneTimeRangesIds)) {
          return true;
        }
      }

      return result;
    }

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
    }

    instance.refreshDatepicker = () => {
      instance.dateDisableDeferred.notify(new Date().getTime());
    };
  };
}
