import angular from 'angular';

export default class ProfilesCtrl {
  constructor(User, Customer, moment, AppConstants, JWT, $mdSidenav, $rootScope, $scope, $modal,
    PageFilterFactory) {
    'ngInject';

    this.Customer = Customer;
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

    $scope.$on('ProfilesCtrl.reload_customers', () => {
      // FIXME: Reset pagination
      this.customers = {};
      this.pagination.reset();
      this.loadCustomers();
    });

    this.loadCustomers();
    PageFilterFactory(this);
  }

  loadCustomers(nextPage = false) {
    if (this.customersLoading || (nextPage && !this.pagination.next())) {
      return;
    }

    this.customersLoading = true;

    this.Customer.getAll(this.current_company_id, undefined, this.pagination.page)
      .then((result) => {
        result.forEach((customer) => {
          const firstChar = customer.first_name ? customer.first_name[0].toUpperCase() : '#';
          if (!this.customers[firstChar]) this.customers[firstChar] = [];
          this.customers[firstChar].push(customer);
        });

        this.pagination.hasMore = !!result.length;
        this.customersLoading = false;
      }, () => {
        this.customersLoading = false;
      });
  }

  openCustomerMenu(customerId) {
    this.$rootScope.$broadcast('UserMenuCtrl.load_full_data', { customerId });
    this.$mdSidenav('right').open();
  }
}
