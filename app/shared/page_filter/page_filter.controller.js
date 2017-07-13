export default class PageFilterCtrl {
  constructor(User, Reservation, moment, $window, $rootScope, $scope, $modal) {
    'ngInject';

    this.current_company_id  = User.current_company.id;

    this.Reservation     = Reservation;
    this.date_filter     = new Date();
    this.$modal          = $modal;
    this.$window         = $window;
    this.$rootScope      = $rootScope;
    this.moment          = moment;
    this.reservations_view = $scope.view;

    $scope.$watch('page_filter.date_filter', (date_filter) => {
      $rootScope.$broadcast('PageFilterCtrl.change_date_filter', date_filter);
    });

    $rootScope.$on('PageFilterCtrl.change_view', (obj, view) => {
      this.reservations_view = view;
    });
  }

  exportCSV() {
    let date = this.moment(this.date_filter).format('YYYY-MM-DD');
    this.Reservation.exportCSV(this.current_company_id, date)
      .then(
        (result) => {
        });
  }

  changeView(view) {
    this.$rootScope.$broadcast('PageFilterCtrl.change_view', view);
  }

  openTimeRangeSettings(type, title) {
    let modalInstance = this.$modal.open({
      templateUrl: 'page_filter_time_ranges.view.html',
      controller: 'PageFilterTimeRangesCtrl as page_filter_time_ranges',
      size: 'md',
      resolve: {
        date: () => {
          return this.date_filter;
        },
        type: () => {
          return type
        },
        title: () => {
          return title;
        }
      }
    });

    modalInstance.result.then((selectedItem) => {
      //success
    }, () => {
      // fail
    });
  }
}
