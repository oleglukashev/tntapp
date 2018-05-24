export default class ProfilesCtrl {
  constructor(User, Customer, moment, AppConstants, UserMenu, JWT,
    $mdSidenav, $rootScope, $scope, $modal, PageFilterFactory) {
    'ngInject';

    this.Customer = Customer;
    this.UserMenu = UserMenu;
    this.current_company_id = User.getCompanyId();

    this.customers = {};
    this.customersLoading = false;

    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$mdSidenav = $mdSidenav;
    this.moment = moment;

    this.pagination = {
      reset: function reset() {
        this.page = 1;
        this.letters = [];
        this.hasMore = true;
      },
      next: function next() {
        if (this.hasMore) {
          this.page += 1;
        }
        return this.hasMore ? this.page : false;
      },
    };
    this.pagination.reset();

    this.$scope.onFilterChanged = letter => this.onFilterChanged(letter);

    $scope.$on('ProfilesCtrl.reload_customers', () => {
      // FIXME: Reset pagination
      this.customers = {};
      this.pagination.reset();
      this.loadCustomers();
    });

    this.loadCustomers();
    PageFilterFactory(this);
    this.$rootScope.show_spinner = true;
  }

  loadCustomers(nextPage = false) {
    if (this.customersLoading || (nextPage && !this.pagination.next())) {
      return;
    }

    this.customersLoading = true;
    this.$rootScope.show_spinner = true;

    this.Customer.getAll(this.current_company_id, false, {
      page: this.pagination.page,
      letter: this.pagination.letters.join(','),
    }).then((result) => {
      this.$rootScope.show_spinner = false;

      result.forEach((customer) => {
        const lastChar = customer.last_name
          ? customer.last_name[0].toUpperCase()
          : customer.first_name[0].toUpperCase();

        if (!this.customers[lastChar]) this.customers[lastChar] = [];
        this.customers[lastChar].push(customer);
      });

      this.pagination.hasMore = !!result.length;
      this.customersLoading = false;
    }, () => {
      this.$rootScope.show_spinner = false;
      this.customersLoading = true;
    });
  }

  openCustomerMenu(customerId) {
    if (!this.UserMenu.isCurrentCustomer(customerId)) {
      this.UserMenu.loadAndSetFullData(this.current_company_id, customerId);
    }

    this.$mdSidenav('right').open();
  }

  onFilterChanged(letters) {
    this.customers = {};
    this.pagination.reset();
    this.pagination.letters = letters.slice();

    if (this.pagination.letters[0] === '&') { // search all
      this.pagination.letters = [];
    }
    this.loadCustomers();
  }
}
