class SearchCtrl {
  constructor(User, Search, Customer, moment, $scope, $state, $rootScope, $stateParams) {
    'ngInject';

    this.current_company = User.current_company;

    this.moment        = moment;
    this.$stateParams  = $stateParams;
    this.$state        = $state;
    this.$rootScope    = $rootScope;
    this.$scope        = $scope;
    this.$scope.class  = "collapse";
    this.Search        = Search;
    this.Customer      = Customer;
    this.months        = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];

    $rootScope.searchResults       = [];
    $rootScope.searchResultsLoaded = false;

    this.loadAll();
  }

  changeClass() {
    if (this.$scope.class === "slideOutRight" || this.$scope.class === "collapse") {
      this.$scope.class = "slideInRight";
    } else {
      if (this.$state.current.name == 'app.search') this.$state.go('app.dashboard')
      this.$scope.class = "slideOutRight";
    }
  }

  querySearch (query) {
    if (!query) return;
    let filtredStated = this.states.filter( this.createFilterFor(query) ).
      sort(this.Search.compare(query, this.Search));
    return query ? filtredStated : this.states;
  }

  selectedItemChange(item) {
    this.Customer.searchReservationsByCustomerId(this.current_company.id, item['value']).then(results => {
      this.$rootScope.searchResults = results;
      this.$rootScope.searchResultsLoaded = true;
    })
    this.$rootScope.searchResultsLoaded = false;
    this.$state.go('app.search');
  }

  loadAll() {
    this.Customer.getAllForSearch(this.current_company.id).then(results => {
      this.states = results.map(customer => ({
        value  : customer['id'],
        display: `${customer['first_name']} ${customer['last_name']}`
      }));
    })
  }

  createFilterFor(query) {
    return function filterFn(state) {
      return (angular.lowercase(state.display).indexOf(angular.lowercase(query)) !== -1);
    }
  }

  parsedDate(date) {
    return this.moment(date).format('h:mm');
  }
}

export default SearchCtrl;