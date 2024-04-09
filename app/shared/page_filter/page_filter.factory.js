export default function PageFilterFactory(AppConstants, Reservation, Customer,
  $uibModal, $filter, $translate, moment) {
  'ngInject';

  return (that) => {
    const instance = that;

    instance.view_type = 'calendar';
    instance.filter_type = 'status';
    instance.date_filter = new Date();
    instance.product_filter_params = [];
    instance.status_filter_params = [];
    instance.product_filter = [];
    instance.status_filter = [];

    instance.sort_params = [{
      name: 'name_a_z',
      value: 'name',
      reverse: false,
    },
    {
      name: 'name_z_a',
      value: 'name',
      reverse: true,
    },
    {
      name: 'reservation',
      value: null,
      reverse: false,
    },
    {
      name: 'time_asc',
      value: 'time',
      reverse: false,
    },
    {
      name: 'time_desc',
      value: 'time',
      reverse: true,
    },
    {
      name: 'guests_asc',
      value: 'number_of_persons',
      reverse: false,
    },
    {
      name: 'guests_desc',
      value: 'number_of_persons',
      reverse: true,
    },
    {
      name: 'status',
      value: 'reservation.status',
      reverse: false,
    },
    {
      name: 'table',
      value: 'table_ids',
      reverse: false,
    }];

    instance.status_filter_params = [{
      name: 'status',
      value: 'confirmed',
      translate: 'confirmed', // don't mix with value
    }, {
      name: 'status',
      value: 'request',
      translate: 'request',
    }, {
      name: 'status',
      value: 'present',
      translate: 'present',
    }, {
      name: 'status',
      value: 'delayed',
      translate: 'delayed',
    }, {
      name: 'status',
      value: 'lead',
      translate: 'lead',
    }, {
      name: 'status',
      value: 'cancelled',
      translate: 'cancelled',
    }];

    instance.sort = instance.sort_params[2];

    instance.status_filter_params.forEach((item) => {
      if (item.value !== 'cancelled') {
        instance.status_filter.push(item);
      }
    });

    instance.cancelFilterIsOn = () => {
      let result = false;

      instance.status_filter.forEach((item) => {
        if (item.value === AppConstants.reservationDutchStatuses.cancelled) {
          result = true;
        }
      });

      return result;
    };

    instance.exportReservationsCSV = () => {
      const date = moment(instance.date_filter).format('YYYY-MM-DD');
      Reservation.exportCSV(instance.current_company_id, date).then(() => {});
    };

    instance.exportCustomersCSV = () => {
      Customer.exportCSV(that.current_company_id).then(() => {});
    };

    instance.changeView = (view) => {
      if (instance.view_type !== view) {
        instance.view_type = view;

        if (view === 'calendar') {
          instance.scrollToNow();
        }
      }
    };

    instance.changeDateFilterPostProcess = () => {
      instance.$rootScope.show_spinner = true;
      instance.loadReservations();
      instance.loadTimeRanges();
    };

    instance.openTimeRangeSettings = (type) => {
      const modalInstance = $uibModal.open({
        templateUrl: 'page_filter_time_ranges.view.html',
        controller: 'PageFilterTimeRangesCtrl as page_filter_time_ranges',
        size: 'md',
        backdrop: 'static',
        resolve: {
          date: () => that.date_filter,
          type: () => type,
        },
      });

      modalInstance.result.then(() => {}, () => {});
    };

    instance.changeFilterPostProcess = () => {
      if (instance.reservations.length) {
        instance.setData();
      }
    };

    instance.applyFilterToReservations = () =>
      instance.reservations.filter((reservation) => {
        let reservationResult = false;

        if (instance.filter_type === 'product') {
          instance.product_filter.forEach((filter) => {
            if (reservation
              .reservation_parts
              .map(part => part.product.name)
              .includes(filter.translate)) {
              reservationResult = true;
            }
          });
        } else if (instance.filter_type === 'status') {
          instance.status_filter.forEach((filter) => {
            if (reservation.status === filter.value) {
              reservationResult = true;
            }
          });
        }

        return reservationResult;
      });

    instance.changeFilterType = (type) => {
      instance.filter_type = type;
    };

    instance.applySort = (parts) => {
      // if (instance.sort.name === 'Reserveringen') {
      //   return $filter('orderByTimeAndRestaurantId')(parts);
      // }

      if (['Reserveringen', 'Reservation'].includes(instance.sort.name)) {
        return instance.defaultSort(parts);
      }

      return $filter('orderBy')(parts, instance.sort.value, instance.sort.reverse);
    };

    instance.defaultSort = (parts) => {
      parts.sort((a, b) => {
        if (a.date_time < b.date_time){
          return -1;
        }
        if (a.date_time > b.date_time){
          return 1;
        }
        return 0;
      });
      const result = [];
      const groupedParts = [];
      const reservationsIdsPositions = {};

      for(const item of parts) {
        if (item.reservation.id in reservationsIdsPositions) {
          groupedParts[reservationsIdsPositions[item.reservation.id]].push(item);
        } else {
          groupedParts.push([item]);
          reservationsIdsPositions[item.reservation.id] = groupedParts.length - 1;
        }
      }
      for(const item of groupedParts) {
        for(const subItem of item) {
          result.push(subItem);
        }
      }
      return result;
    }


    // run sort translates
    $translate(instance.sort_params.map(item => `sort.${item.name}`)).then((translations) => {
      instance.sort_params.forEach((item, index) => {
        instance.sort_params[index].name = translations[`sort.${item.name}`];
      });
    }, (translationIds) => {
      instance.sort_params.forEach((item, index) => {
        instance.sort_params[index].name = translationIds[`sort.${item.name}`];
      });
    });

    // run status translates
    $translate(instance.status_filter_params.map(item => `status.${item.value}`)).then((translations) => {
      instance.status_filter_params.forEach((item, index) => {
        instance.status_filter_params[index].translate = translations[`status.${item.value}`];
      });
    }, (translationIds) => {
      instance.status_filter_params.forEach((item, index) => {
        instance.status_filter_params[index].translate = translationIds[`status.${item.value}`];
      });
    });
  };
}
