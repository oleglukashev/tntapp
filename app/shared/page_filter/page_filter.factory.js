export default function PageFilterFactory(AppConstants, Reservation, Customer,
  $modal, $filter, $translate, moment) {
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
      const modalInstance = $modal.open({
        templateUrl: 'page_filter_time_ranges.view.html',
        controller: 'PageFilterTimeRangesCtrl as page_filter_time_ranges',
        size: 'md',
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
      if (instance.sort.name === 'Reserveringen') {
        return $filter('orderByTimeAndRestaurantId')(parts);
      }

      return $filter('orderBy')(parts, instance.sort.value, instance.sort.reverse);
    };


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
