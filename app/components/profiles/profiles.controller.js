import angular from 'angular';

export default class ProfilesCtrl {
  constructor(User, Customer, moment, AppConstants, JWT, $mdSidenav, $rootScope, $scope, $modal) {
    'ngInject';

    this.Customer         = Customer;
    this.current_company  = User.current_company;

    this.customers        = {};
    this.customers_loaded = false;
    this.$scope           = $scope;
    this.$rootScope       = $rootScope;
    this.$mdSidenav       = $mdSidenav;
    this.moment           = moment;

    this.loadCustomers();
  }

  exportCSV() {
    this.Customer.exportCSV(this.current_company.id)
      .then(
        (result) => {
        });
  }

  loadCustomers() {
    this.Customer.getAll(this.current_company.id)
      .then(
        (result) => {
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
