export default class SettingsEmployeesCtrl {
  constructor(User, Employee, filterFilter, $modal) {
    'ngInject';

    this.current_company_id = User.getCompanyId();

    this.filterFilter = filterFilter;
    this.Employee     = Employee;
    this.is_loaded    = false;
    this.$modal       = $modal;

    this.loadEmployees();
  }

  addEmployee() {
    let that = this;
    let modalInstance = this.$modal.open({
      templateUrl: 'settings_employees.item.view.html',
      controller: 'SettingsEmployeesItemCtrl as employee',
      size: 'md',
      resolve: {
          items: function () {
            return that.employees;
          },
          item: function () {
            return null;
          }
        }
    });

    modalInstance.result.then((selectedItem) => {}, () => {});
  }

  editEmployee(id) {
    let that = this;
    let modalInstance = this.$modal.open({
      templateUrl: 'settings_employees.item.view.html',
      controller: 'SettingsEmployeesItemCtrl as employee',
      size: 'md',
      resolve: {
          items: function () {
            return that.employees;
          },
          item: function () {
            return that.filterFilter(that.employees, { id: id })[0];
          }
        }
    });

    modalInstance.result.then((selectedItem) => {}, () => {});
  }

  loadEmployees() {
    this.Employee
      .getAll(this.current_company_id)
        .then(
          (employees) => {
            this.is_loaded = true;
            this.employees = employees;
          });
  }
}