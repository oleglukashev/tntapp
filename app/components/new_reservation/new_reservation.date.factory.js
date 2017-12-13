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

      console.log(date);

      if (instance.product_week_time_ranges[dateWeekDay]) {
        const productIds = Object.keys(instance.product_week_time_ranges[dateWeekDay]);
        let productsOpened = false;
        productIds.forEach((productId) => {
          const timeRange = instance.product_week_time_ranges[dateWeekDay][productId];
          result = !timeRange.value;

          if (timeRange.value) {
            productsOpened = true;
          }

          if (!timeRange.value && !closedProductTimeRangesIds.includes(parseInt(productId))) {
            closedProductTimeRangesIds.push(parseInt(productId));
          }

          console.log('-- product week time range --');
          console.log(timeRange)
        });

        console.log(`opened: ${productsOpened}`);
        result = !productsOpened;
      }

      if (instance.open_time_ranges[dateFormat]) {
        const timeRange = instance.open_time_ranges[dateFormat];

        if (timeRange.value) {
          result = false;
        } else if (!timeRange.value && timeRange.whole_day) {
          result = true;
        }

        console.log('-- open time range --');
        console.log(`opened: ${!result}`);
        console.log(timeRange);
      }

      if (instance.product_time_ranges[dateFormat]) {
        const productIds = Object.keys(instance.product_time_ranges[dateFormat]);
        let productsOpened = false;
        productIds.forEach((productId) => {
          const product = filterFilter(instance.products, { id: productId })[0];
          const timeRange = instance.product_time_ranges[dateFormat][productId];

          if (!product || product.shaded) {
            console.log('-- product --');
            console.log(`hidden: ${product.id}`);
            if (!closedProductTimeRangesIds.includes(parseInt(productId))) {
              closedProductTimeRangesIds.push(parseInt(productId));
            }
          } else {
            if (!timeRange.value && timeRange.whole_day) {
              if (!closedProductTimeRangesIds.includes(parseInt(productId))) {
                closedProductTimeRangesIds.push(parseInt(productId));
              }
            } else {
              productsOpened = true;
            }
          }

          console.log('-- product --');
          console.log(timeRange);
        });

        console.log(`opened: ${productsOpened}`);
        result = !productsOpened;
      }

      const productIds = instance.products.map(product => product.id).sort();
      closedProductTimeRangesIds = closedProductTimeRangesIds.sort();

      if (angular.equals(productIds, closedProductTimeRangesIds)) {
        console.log('-- products closed --');
        console.log('list of products are uniq with list of closed products');
        console.log('-- TOTAL --');
        console.log(false);
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
          console.log('-- zones closed --');
          console.log('list of zones are uniq with list of closed zones');
          console.log('-- TOTAL --');
          console.log(false);
          return true;
        }
      }

      console.log('-- TOTAL --');
      console.log(!result);

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
