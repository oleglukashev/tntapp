import angular from 'angular';

class SearchCtrl {
  constructor(ReservationStatus, Table, User, Search, Customer, moment, filterFilter,
    $scope, $state, $rootScope, $stateParams) {
    'ngInject';

    this.current_company_id = User.getCompanyId();

    this.ReservationStatus = ReservationStatus;
    this.Table = Table;
    this.filterFilter = filterFilter;
    this.moment = moment;
    this.$stateParams = $stateParams;
    this.$state = $state;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$scope.class = 'collapse';
    this.Search = Search;
    this.Customer = Customer;
    this.months = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];
    this.tables = [];

    this.$rootScope.searchResults = [];
    this.$rootScope.searchResultsLoaded = false;

    this.loadCustomers();
  }

  changeClass() {
    if (this.$scope.class === 'slideOutRight' || this.$scope.class === 'collapse') {
      this.$scope.class = 'slideInRight';
    } else {
      if (this.$state.current.name === 'app.search') this.$state.go('app.dashboard');
      this.$scope.class = 'slideOutRight';
    }
  }

  querySearch(query) {
    if (!query) return;
    return this.states.filter(this.createFilterFor(query))
      .sort(this.Search.compare(query, this.Search));
  }

  selectedItemChange(item) {
    this.$rootScope.searchResults = [];
    if (item) {
      this.Customer.searchReservationsByCustomerId(this.current_company_id, item.value).then((reservations) => {
        if (reservations.length > 0 && reservations[0].reservation_parts.length > 0) {
          this.$rootScope.searchResults = this.ReservationStatus.translateAndcheckStatusForDelay(reservations);
          this.$rootScope.dateHeader = this.dateHeader(reservations[0]);
        }
        this.$rootScope.searchResultsLoaded = true;
      });

      this.$rootScope.searchResultsLoaded = false;

      if (this.$state.$current.name !== 'app.search') this.$state.go('app.search');
    }
  }

  loadCustomers() {
    this.Customer.getAllForSearch(this.current_company_id).then((results) => {
      this.states = results.map(customer => ({
        value: customer.id,
        display: `${customer.last_name} ${customer.first_name}`,
      }));
      this.loadTables();
    });
  }

  loadTables() {
    this.tables = [];

    this.Table.getAll(this.current_company_id).then(
      (result) => {
        this.tables = result;
      },
      () => {});
  }

  createFilterFor(query) {
    return function filterFn(state) {
      return (angular.lowercase(state.display).indexOf(angular.lowercase(query)) !== -1);
    };
  }

  dateHeader(reservation) {
    const date = new Date(reservation.reservation_parts[0].date_time);
    return this.moment(date).format('DD-MM-YYYY');
  }
}

export default SearchCtrl;
