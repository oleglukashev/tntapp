import customerMergeTemplate from './merge/customers.merge.view.html';

export default class CustomerCtrl {
  constructor(User, Customer, CustomerService, moment, AppConstants, UserMenu, JWT,
    $mdSidenav, $rootScope, $scope, $uibModal, PageFilterFactory) {
    'ngInject';

    this.Customer = Customer;
    this.CustomerService = CustomerService;
    this.UserMenu = UserMenu;
    this.current_company_id = User.getCompanyId();

    this.$scope = $scope;
    this.$modal = $uibModal;
    this.$rootScope = $rootScope;
    this.$mdSidenav = $mdSidenav;
    this.moment = moment;

    this.$scope.onFilterChanged = letter => this.onFilterChanged(letter);
    this.CustomerService.initCustomers(this.current_company_id).then(() => {
      this.is_loaded = true;
    });

    this.is_loaded = false;

    PageFilterFactory(this);
  }

  loadCustomers(nextPage = false) {
    this.CustomerService.loadCustomers(this.current_company_id, nextPage);
  }

  openCustomerMenu(customerId) {
    if (!this.UserMenu.isCurrentCustomer(customerId)) {
      this.UserMenu.loadAndSetFullData(customerId);
    }

    this.$mdSidenav('right').open();
  }

  onFilterChanged(letters) {
    this.CustomerService.store = {};
    this.CustomerService.pagination.reset();
    this.CustomerService.pagination.letters = letters.slice();

    if (this.CustomerService.pagination.letters[0] === '&') { // search all
      this.CustomerService.pagination.letters = [];
    }
    this.loadCustomers();
  }

  openMergePopup() {
    const modalInstance = this.$modal.open({
      template: customerMergeTemplate,
      controller: 'CustomerMergeCtrl as customer_merge',
      size: 'md',
      backdrop: 'static',
    });

    modalInstance.result.then(() => {}, () => {});
  }

  isEmpty() {
    return Object.keys(this.CustomerService.store).length === 0;
  }
}
