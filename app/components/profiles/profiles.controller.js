import angular from 'angular';

export default class ProfilesCtrl {
  constructor(User, Customer, moment, AppConstants, JWT, $mdSidenav, $rootScope, $scope, $modal) {
    'ngInject';

    this.Customer         = Customer;
    this.current_company_id  = User.getCompanyId();

    this.customers_loaded = false;
    this.$scope           = $scope;
    this.$rootScope       = $rootScope;
    this.$mdSidenav       = $mdSidenav;
    this.moment           = moment;

    $scope.$on('ProfilesCtrl.reload_customers', () => {
      this.loadCustomers();
    });

    this.loadCustomers();
  }

  exportCSV() {
    this.Customer.exportCSV(this.current_company_id)
      .then(
        (result) => {
        });
  }

  loadCustomers() {
    this.Customer.getAll(this.current_company_id)
      .then(
        (result) => {
          this.customers = {};
          result.map(customer => {
            let first_char = customer.first_name ? customer.first_name[0].toUpperCase() : '#';
            if (!this.customers[first_char]) this.customers[first_char] = [];
            this.customers[first_char].push(customer);
          });
          this.customers_loaded = true;
        });
  }

  openCustomerMenu() {
    this.$rootScope.$broadcast('UserMenuCtrl');
    this.$mdSidenav('right').toggle();
  }
}
