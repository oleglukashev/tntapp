export default function PageFilterFactory(AppConstants, Reservation, Customer,
  $modal, $filter, moment, filterFilter) {
  'ngInject';

  return (that) => {
    const instance = that;

    instance.view_type = 'calendar';
    instance.date_filter = new Date();
    instance.filter_params = [];
    instance.sort_params = [{
      name: 'Naam A-Z',
      value: 'last_name',
      reverse: false,
    },
    {
      name: 'Naam Z-A',
      value: 'last_name',
      reverse: true,
    },
    {
      name: 'Datum oplopend',
      value: 'date',
      reverse: false,
    },
    {
      name: 'Datum aflopend',
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

    instance.filters = [];
    instance.sort = instance.sort_params[0];

    Object.keys(AppConstants.reservationStatuses).forEach((item) => {
      const filterItem = {
        name: 'status',
        value: AppConstants.reservationDutchStatuses[item],
      };

      instance.filter_params.push(filterItem);
      instance.filters.push(filterItem);
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
        instance.scrollToNow();
      }
    };

    instance.changeDateFilterPostProcess = () => {
      instance.current_day = (new Date(instance.date_filter)).getDay();
      instance.is_loaded = false;
      instance.is_today = false;
      instance.reservations = [];
      instance.loadReservations();

      if (moment().format('YYYY-MM-DD') ===
          moment(instance.date_filter).format('YYYY-MM-DD')) {
        instance.is_today = true;
        instance.scrollToNow();
      }
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
        if (instance.setData) instance.setData();
        if (instance.setGraphData) instance.setGraphData();
      }
    };

    instance.applyFilterToReservations = () => {
      let result = [];
      if (!instance.reservations.length) return result;

      instance.filters.forEach((filter) => {
        if (filter.name === 'status') {
          result = result.concat(filterFilter(instance.reservations, {
            status: AppConstants.reservationDutchStatuses[filter.value],
          }));
        } else if (filter.name === 'product') {
          result = result.concat(instance.reservations.filter((reservation) => {
            return reservation.reservation_parts.map(part => part.product.name).includes(filter.value);
          }));
        }
      });

      return result.filter((value, index) => result.indexOf(value) === index);
    };

    instance.applySort = (parts) => {
      return $filter('orderBy')(parts, instance.sort.value, instance.sort.reverse);
    };
  };
}
