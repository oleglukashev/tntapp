import angular from 'angular';

class SearchHeaderCtrl {
  constructor(Customer, Search, User, moment, ReservationStatus,
    $state, $scope, $rootScope) {
    'ngInject';

    this.current_company_id = User.getCompanyId();

    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$scope.class = 'collapse';
    this.$state = $state;
    this.moment = moment;
    this.Customer = Customer;
    this.ReservationStatus = ReservationStatus;
    this.Search = Search;
    this.states = [];

    this.loadCustomers();
  }

  loadCustomers() {
    this.Customer.getAllForSearch(this.current_company_id).then((results) => {
      this.states = results.map(customer => ({
        value: customer.id,
        display: `${customer.last_name} ${customer.first_name}`,
      }));
    });
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
    if (!item) return;

    this
      .Customer
      .searchReservationsByCustomerId(this.current_company_id, item.value)
      .then((reservations) => {
        this.$state.go('app.search', { reservations }, { reload: true });
      });
  }

  createFilterFor(query) {
    return function filterFn(state) {
      return (angular.lowercase(state.display).indexOf(angular.lowercase(query)) !== -1);
    };
  }
}

export default SearchHeaderCtrl;
