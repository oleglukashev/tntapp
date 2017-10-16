export default function PageFilterFactory(AppConstants, Reservation, Customer, $modal, moment, filterFilter) {
  return (that) => {
    const instance = that;

    instance.view_type = 'calendar';
    instance.date_filter = new Date();
    instance.filter_params = [];
    instance.filters = [];

    Object.keys(AppConstants.reservationDutchStatuses).forEach((item) => {
      const filterItem = {
        name: 'status',
        value: item,
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
        instance.loadReservations();
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
        if (instance.setTableOptions) instance.setTableOptions();
        if (instance.setTableOptions) instance.setGraphData();
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
  };
}
