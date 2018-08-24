export default class CustomerService {
  constructor(Customer, $rootScope, $q) {
    'ngInject';

    this.Customer = Customer;
    this.store = {};
    this.$rootScope = $rootScope;
    this.$q = $q;
    this.customersLoading = false;

    this.pagination = {
      page: 1,
      letters: [],
      hasMore: true,
      reset: () => {
        this.pagination.page = 1;
        this.pagination.letters = [];
        this.pagination.hasMore = true;
      },
      next: () => {
        if (this.pagination.hasMore) {
          this.pagination.page += 1;
        }
        return this.pagination.hasMore ? this.pagination.page : false;
      },
    };

    this.pagination.reset();
  }

  loadCustomers(companyId, nextPage = false) {
    if (this.customersLoading || (nextPage && !this.pagination.next())) {
      return this.$q.defer().promise;
    }

    this.customersLoading = true;

    if (this.pagination.page !== 1) {
      this.$rootScope.show_spinner = true;
    }

    return this.Customer.getAll(companyId, false, {
      page: this.pagination.page,
      letter: this.pagination.letters.join(','),
    }).then((result) => {
      this.$rootScope.show_spinner = false;

      result.forEach((customer) => {
        const lastChar = customer.last_name
          ? customer.last_name[0].toUpperCase()
          : customer.first_name[0].toUpperCase();

        if (!this.store[lastChar]) this.store[lastChar] = [];
        this.store[lastChar].push(customer);
      });

      this.pagination.hasMore = !!result.length;
      this.customersLoading = false;
    }, () => {
      this.$rootScope.show_spinner = false;
      this.customersLoading = true;
    });
  }

  initCustomers(companyId) {
    this.store = {};
    this.pagination.reset();
    return this.loadCustomers(companyId);
  }
}
