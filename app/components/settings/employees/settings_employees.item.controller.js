export default class Controller {
  constructor(User, Employee, item, items, $uibModalInstance, $rootScope) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.item = item;

    if (!this.item) {
      this.item = {
        name: 'waiter',
      };
    }

    this.items = items;
    this.Employee = Employee;
    this.$modalInstance = $uibModalInstance;
    this.$rootScope = $rootScope;
  }

  submitForm() {
    this.createEmployee();
  }

  closeModal() {
    this.$modalInstance.dismiss('cancel');
  }

  createEmployee() {
    const data = {
      name: this.item.name,
      email: this.item.email,
      last_name: this.item.last_name,
      first_name: this.item.first_name,
    };

    this.is_submitting = true;
    this.$rootScope.show_spinner = true;
    this.Employee
      .create(this.current_company_id, data).then(
        (employee) => {
          this.is_submitting = false;
          this.$rootScope.show_spinner = false;
          this.items.push(employee);
          this.$modalInstance.dismiss('cancel');
        },
        (error) => {
          this.is_submitting = false;
          this.$rootScope.show_spinner = false;
          this.errors = error.data.errors;
        },
      );
  }

  destroy() {
    this.is_submitting = true;
    this.$rootScope.show_spinner = true;

    this.Employee
      .destroy(this.current_company_id, this.item.id).then(
        () => {
          this.is_submitting = false;
          this.$rootScope.show_spinner = false;
          this.items.splice(this.items.indexOf(this.item), 1);
          this.$modalInstance.dismiss('cancel');
        },
        () => {
          this.is_submitting = false;
          this.$rootScope.show_spinner = false;
        },
      );
  }

  showConfirm() {
    if (confirm('Weet je het zeker?')) {
      this.destroy();
    }
  }
}
