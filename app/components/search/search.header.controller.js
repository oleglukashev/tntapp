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
  }

  changeClass() {
    if (this.$scope.class === 'slideOutRight' || this.$scope.class === 'collapse') {
      this.$scope.class = 'slideInRight';
    } else {
      if (this.$state.current.name === 'app.search') this.$state.go('app.dashboard');
      this.$scope.class = 'slideOutRight';
    }
  }

  search(query) {
    if (!query) return [];
    return this.Customer.search(this.current_company_id, query).then((result) => {
      return result.map((customer) => {
        return {
          value: customer.id,
          display: `${customer.first_name} ${customer.last_name}`,
        };
      });
    });
  }

  selectedItemChange(item) {
    if (!item) return;

    this
      .Customer
      .searchReservationsByCustomerId(this.current_company_id, item.value)
      .then((result) => {
        this.$state.go('app.search', { reservations: result.reservations }, { reload: true });
      });
  }
}

export default SearchHeaderCtrl;
