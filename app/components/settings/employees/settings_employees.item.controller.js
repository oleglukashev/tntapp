export default class SettingsEmployeesItemCtrl {
  constructor(User, Employee, item, items, $modalInstance, Confirm) {
    'ngInject';

    this.Confirm = Confirm;
    this.current_company_id = User.getCompanyId();
    this.item = item;
    this.items = items;
    this.Employee = Employee;
    this.$modalInstance = $modalInstance;
  }

  submitForm() {
    this.createEmployee();
  }

  createEmployee() {
    this.is_submitting = true;

    const data = {
      manage_access: this.item.manage_access,
      email: this.item.email,
      last_name: this.item.last_name,
      first_name: this.item.first_name,
    };

    this.Employee
      .create(this.current_company_id, data).then(
        (employee) => {
          this.is_submitting = false;
          this.items.push(employee);
          this.$modalInstance.dismiss('cancel');
        },
        (error) => {
          this.is_submitting = false;
          this.errors = error.data.errors;
        },
      );
  }

  updateEmployee() {
    this.is_submitting = true;

    const data = {
      manage_access: this.item.manage_access,
    };

    this.Employee
      .update(this.current_company_id, this.item.id, data).then(
        () => {
          this.is_submitting = false;
          this.$modalInstance.dismiss('cancel');
        },
        (error) => {
          this.is_submitting = false;
          this.errors = error.data.errors;
        },
      );
  }

  destroy() {
    this.is_submitting = true;
    this.Employee
      .destroy(this.current_company_id, this.item.id).then(
        () => {
          this.is_submitting = false;
          this.items.splice(this.items.indexOf(this.item), 1);
          this.$modalInstance.dismiss('cancel');
        },
        () => {
          this.is_submitting = false;
        },
      );
  }

  showConfirm() {
    if (confirm('Weet je het zeker?')) {
      this.destroy();
    }
  }
}
