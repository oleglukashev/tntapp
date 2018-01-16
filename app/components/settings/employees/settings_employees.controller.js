export default class SettingsEmployeesCtrl {
  constructor(User, Employee, filterFilter, $modal, $rootScope) {
    'ngInject';

    this.current_company_id = User.getCompanyId();

    this.filterFilter = filterFilter;
    this.Employee = Employee;
    this.$modal = $modal;
    this.$rootScope = $rootScope;

    this.loadEmployees();

    this.is_loaded = false;
    this.$rootScope.show_spinner = true;
  }

  addEmployee() {
    const modalInstance = this.$modal.open({
      templateUrl: 'settings_employees.item.view.html',
      controller: 'SettingsEmployeesItemCtrl as employee',
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
      templateUrl: 'settings_employees.item.view.html',
      controller: 'SettingsEmployeesItemCtrl as employee',
      size: 'md',
      resolve: {
        items: () => this.employees,
        item: () => this.filterFilter(this.employees, { id })[0],
      },
    });

    modalInstance.result.then(() => {}, () => {});
  }

  loadEmployees() {
    this.Employee
      .getAll(this.current_company_id)
      .then((employees) => {
        this.$rootScope.show_spinner = false;
        this.is_loaded = true;
        this.employees = employees;
      });
  }
}
