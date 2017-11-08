import angular from 'angular';

export default class ProfilesCtrl {
  constructor(User, Customer, moment, AppConstants, JWT, $mdSidenav, $rootScope, $scope, $modal,
    PageFilterFactory) {
    'ngInject';

    this.Customer = Customer;
    this.current_company_id = User.getCompanyId();

    this.customers_loaded = false;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$mdSidenav = $mdSidenav;
    this.moment = moment;

    $scope.$on('ProfilesCtrl.reload_customers', () => {
      this.loadCustomers();
    });

    this.loadCustomers();
    PageFilterFactory(this);
  }

  loadCustomers() {
    this.Customer.getAll(this.current_company_id)
      .then((result) => {
        this.customers = {};
        result.map((customer) => {
          const firstChar = customer.first_name ? customer.first_name[0].toUpperCase() : '#';
          if (!this.customers[firstChar]) this.customers[firstChar] = [];
          this.customers[firstChar].push(customer);
        });
        this.customers_loaded = true;
      });
  }

  openCustomerMenu(customerId) {
    this.$rootScope.$broadcast('UserMenuCtrl.load_full_data', { customerId });
    this.$mdSidenav('right').open();
  }
}
