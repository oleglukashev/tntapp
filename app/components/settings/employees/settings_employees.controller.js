import itemSettingsEmployeesView from './settings_employees.item.view.html';
import itemSettingsEmployeesController from './settings_employees.item.controller';

export default class Controller {
  constructor(User, Employee, filterFilter, $uibModal, $rootScope) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.isOwner = User.isOwner();

    this.filterFilter = filterFilter;
    this.Employee = Employee;
    this.$modal = $uibModal;
    this.$rootScope = $rootScope;

    this.userIsManager = User.isManager.bind(User);
    if (this.userIsManager()) {
      this.loadEmployees();
    } else {
      // no access
      window.location.href = '/';
    }

    this.is_loaded = false;
    this.employee_form = {};
  }

  submitForm(id) {
    this.updateEmployee(id, this.employee_form[id])
  }

  updateEmployee(id, data) {
    this.is_submitting = true;
    this.$rootScope.show_spinner = true;

    this.Employee
      .update(this.current_company_id, id, data).then(
        () => {
          this.is_submitting = false;
          this.$rootScope.show_spinner = false;
          //this.$modalInstance.dismiss('cancel');
        },
        (error) => {
          this.is_submitting = false;
          this.$rootScope.show_spinner = false;
          this.errors = error.data.errors;
        },
      );
  }

  destroyEmployee(employee) {
    this.is_submitting = true;
    this.$rootScope.show_spinner = true;

    this.Employee
      .destroy(this.current_company_id, employee.id).then(
        () => {
          this.is_submitting = false;
          this.$rootScope.show_spinner = false;
          this.employees.splice(this.employees.indexOf(employee), 1);
          this.$modalInstance.dismiss('cancel');
        },
        () => {
          this.is_submitting = false;
          this.$rootScope.show_spinner = false;
        },
      );
  }

  addEmployee() {
    const modalInstance = this.$modal.open({
      template: itemSettingsEmployeesView,
      controller: itemSettingsEmployeesController,
      controllerAs: 'ctrl',
      size: 'md',
      backdrop: 'static',
      resolve: {
        items: () => this.employees,
        item: () => null,
      },
    });

    modalInstance.result.then(() => {}, () => {});
  }

  editEmployee(id) {
    const modalInstance = this.$modal.open({
      template: itemSettingsEmployeesView,
      controller: itemSettingsEmployeesController,
      controllerAs: 'ctrl',
      size: 'md',
      backdrop: 'static',
      resolve: {
        items: () => this.employees,
        item: () => this.filterFilter(this.employees, { id })[0],
      },
    });

    modalInstance.result.then(() => {}, () => {});
  }

  loadEmployees() {
    this.Employee.getAll(this.current_company_id).then((employees) => {
      this.is_loaded = true;
      this.employees = employees;
      employees.forEach((item) => {
        this.employee_form[item.id] = { name: item.name };
      })
    });
  }
}
