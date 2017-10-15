export default class PageFilterCtrl {
  constructor(User, Reservation, moment, $window, $rootScope, $scope, $modal, Confirm) {
    'ngInject';

    this.current_company_id = User.getCompanyId();

    this.Confirm = Confirm;
    this.Reservation = Reservation;
    this.dateFilter = new Date();
    this.$modal = $modal;
    this.$window = $window;
    this.$rootScope = $rootScope;
    this.moment = moment;
    this.reservations_view = $scope.view;

    $scope.$watch('page_filter.date_filter', (dateFilter) => {
      $rootScope.$broadcast('PageFilterCtrl.change_dateFilter', dateFilter);
    });

    $rootScope.$on('PageFilterCtrl.change_view', (obj, view) => {
      this.reservations_view = view;
    });
  }

  exportCSV() {
    const date = this.moment(this.dateFilter).format('YYYY-MM-DD');
    this.Reservation.exportCSV(this.current_company_id, date)
      .then(() => {});
  }

  changeView(view) {
    this.$rootScope.$broadcast('PageFilterCtrl.change_view', view);
  }

  openTimeRangeSettings(type, title) {
    const modalInstance = this.$modal.open({
      templateUrl: 'page_filter_time_ranges.view.html',
      controller: 'PageFilterTimeRangesCtrl as page_filter_time_ranges',
      size: 'md',
      resolve: {
        date: () => this.dateFilter,
        type: () => type,
        title: () => title,
      },
    });

    modalInstance.result.then(() => {
      // success
    }, () => {
      // fail
    });
  }
}
