export default class CustomerMergeCtrl {
  constructor(User, Customer, CustomerService, $modalInstance, $rootScope) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Customer = Customer;
    this.CustomerService = CustomerService;
    this.$modalInstance = $modalInstance;
    this.$rootScope = $rootScope;

    this.auto_merge = [];
    this.manual_merge = [];

    this.fields = [
      'first_name',
      'last_name',
      'primary_phone_number',
      'secondary_phone_number',
      'street',
      'date_of_birth',
      'house_number',
      'zipcode',
      'city',
      'mail',
      'gender',
    ];

    this.loadMatchData();
  }

  loadMatchData() {
    this.$rootScope.show_spinner = true;
    this.Customer.getMatchData(this.current_company_id).then((result) => {
      this.auto_merge = result.auto_merge;
      this.auto_merge.forEach((item, index) => {
        this.auto_merge[index].merge = {
          source: item.source.id,
          target: item.target.id,
          is_manual: false,
        };
      });

      this.manual_merge = result.manual_merge;
      this.manual_merge.forEach((item, index) => {
        const merge = {
          source: item.source.id,
          target: item.target.id,
          is_manual: true,
        };

        merge.fields = {};
        this.fields.forEach((field) => {
          merge.fields[field] = 'target';
        });

        this.manual_merge[index].merge = merge;
      });
      this.$rootScope.show_spinner = false;
    });
  }

  canCompareField(field, value1, value2) {
    return this.fields.includes(field) && value1 !== value2;
  }

  merge(mergeData) {
    this.$rootScope.show_spinner = true;
    this.Customer.merge(this.current_company_id, mergeData.merge).then(() => {
      this.loadMatchData();
      this.CustomerService.initCustomers(this.current_company_id);
    });
  }

  ignore(mergeData) {
    const data = {
      source: mergeData.merge.source,
      target: mergeData.merge.target,
    };

    this.$rootScope.show_spinner = true;
    this.Customer.ignore(this.current_company_id, data).then(() => {
      this.loadMatchData();
      this.CustomerService.initCustomers(this.current_company_id);
    });
  }
}
