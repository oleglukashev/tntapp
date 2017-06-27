export default class PageFilterCtrl {
  constructor($window, $rootScope, $scope, $modal) {
    'ngInject';

    this.date_filter     = new Date();
    this.$modal          = $modal;
    this.$window         = $window;
    this.$rootScope      = $rootScope;
    this.reservations_view = $scope.view;

    $scope.$watch('page_filter.date_filter', (date_filter) => {
      $rootScope.$broadcast('PageFilterCtrl.change_date_filter', date_filter);
    });

    $rootScope.$on('PageFilterCtrl.change_view', (obj, view) => {
      this.reservations_view = view;
    });
  }

  changeView(view) {
    this.$rootScope.$broadcast('PageFilterCtrl.change_view', view);
  }

  openSettings() {
    let modalInstance = this.$modal.open({
      templateUrl: 'page_filter_settings.view.html',
      controller: 'PageFilterSettingsCtrl as page_filter_settings',
      size: 'md',
      resolve: {
        date: () => {
          return this.date_filter;
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
