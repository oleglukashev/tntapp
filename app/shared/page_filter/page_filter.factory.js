export default function PageFilterFactory(AppConstants, Reservation, Customer,
  $modal, $filter, moment) {
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
      name: 'Naam A-Z',
      value: 'name',
      reverse: false,
    },
    {
      name: 'Naam Z-A',
      value: 'name',
      reverse: true,
    },
    {
      name: 'Tijd oplopend',
      value: 'date',
      reverse: false,
    },
    {
      name: 'Tijd aflopend',
      value: 'date',
      reverse: true,
    },
    {
      name: 'Aantal personen oplopend',
      value: 'number_of_persons',
      reverse: false,
    },
    {
      name: 'Aantal personen aflopend',
      value: 'number_of_persons',
      reverse: true,
    },
    {
      name: 'Status',
      value: 'reservation.status',
      reverse: false,
    },
    {
      name: 'Tafel',
      value: 'table_ids',
      reverse: false,
    }];

    instance.sort = instance.sort_params[0];

    AppConstants.reservationStatuses.forEach((item) => {
      const filterItem = {
        name: 'status',
        value: AppConstants.reservationDutchStatuses[item],
      };

      instance.status_filter_params.push(filterItem);

      if (item !== 'cancelled') {
        instance.status_filter.push(filterItem);
      }
    });

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
      instance.loadReservations();
      instance.loadTimeRanges();
    };

    instance.openTimeRangeSettings = (type, title) => {
      const modalInstance = $modal.open({
        templateUrl: 'page_filter_time_ranges.view.html',
        controller: 'PageFilterTimeRangesCtrl as page_filter_time_ranges',
        size: 'md',
        resolve: {
          date: () => that.date_filter,
          type: () => type,
          title: () => title,
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
              .includes(filter.value)) {
              reservationResult = true;
            }
          });
        } else if (instance.filter_type === 'status') {
          instance.status_filter.forEach((filter) => {
            if (reservation.status === AppConstants.reservationEnglishStatuses[filter.value]) {
              reservationResult = true;
            }
          });
        }

        return reservationResult;
      });

    instance.changeFilterType = (type) => {
      instance.filter_type = type;
    };

    instance.applySort = parts =>
      $filter('orderBy')(parts, instance.sort.value, instance.sort.reverse);
  };
}
