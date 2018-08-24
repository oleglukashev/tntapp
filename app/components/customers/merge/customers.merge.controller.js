export default class CustomerMergeCtrl {
  constructor(User, Customer, CustomerService, $uibModalInstance, $rootScope) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Customer = Customer;
    this.CustomerService = CustomerService;
    this.$modalInstance = $uibModalInstance;
    this.$rootScope = $rootScope;

    this.mergeData = [];

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
      this.mergeData = [];

      [result.auto_merge, result.manual_merge].forEach((scope, index) => {
        scope.forEach((item) => {
          const newItem = item;

          newItem.data = {
            source: item.source.id,
            target: item.target.id,
            is_manual: index === 1,
          };

          if (index === 1) {
            newItem.data.fields = {};
            this.fields.forEach((field) => {
              newItem.data.fields[field] = 'target';
            });
          }

          this.mergeData.push(newItem);
        });
      });
  
      this.$rootScope.show_spinner = false;
    });
  }

  canCompareField(field, value1, value2) {
    return this.fields.includes(field) && value1 !== value2;
  }

  submitForm() {
    this.$rootScope.show_spinner = true;

    const data = this.mergeData.map(item => item.data);

    this.Customer.merge(this.current_company_id, data).then(() => {
      this.loadMatchData();
      this.CustomerService.initCustomers(this.current_company_id);
    });
  }
}
