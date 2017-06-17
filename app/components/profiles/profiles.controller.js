import angular from 'angular';

export default class ProfilesCtrl {
  constructor(Customer, moment, AppConstants, JWT, $mdSidenav, $rootScope, $scope, $modal) {
    'ngInject';

    this.Customer         = Customer;

    this.customers        = {};
    this.customers_loaded = false;
    this.$scope           = $scope;
    this.$rootScope       = $rootScope;
    this.$mdSidenav       = $mdSidenav;
    this.moment           = moment;

    this.loadCustomers();
  }

  exportCSV() {
    this.Customer.exportCSV()
      .then(
        (result) => {
        });
  }

  loadCustomers() {
    this.Customer.getAll()
      .then(
        (result) => {
          this.customers = result;
          this.customers_loaded = true;
        });
  }

  openUserMenu() {
    this.$rootScope.$broadcast('UserMenuCtrl');
    this.$mdSidenav('right').toggle();
  }
}
