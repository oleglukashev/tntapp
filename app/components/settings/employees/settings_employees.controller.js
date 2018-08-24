import itemSettingsEmployeesView from './settings_employees.item.view.html';
import itemSettingsEmployeesController from './settings_employees.item.controller';

export default class Controller {
  constructor(User, Employee, filterFilter, $uibModal, $rootScope) {
    'ngInject';

    this.current_company_id = User.getCompanyId();

    this.filterFilter = filterFilter;
    this.Employee = Employee;
    this.$modal = $uibModal;
    this.$rootScope = $rootScope;

    this.loadEmployees();

    this.is_loaded = false;
  }

  addEmployee() {
    const modalInstance = this.$modal.open({
      template: itemSettingsEmployeesView,
      controller: itemSettingsEmployeesController,
      controllerAs: 'ctrl',
      size: 'md',
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
    });
  }
}
