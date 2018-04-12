export default class SettingsTablesNewGroupTableCtrl {
  constructor(groupTables, User, GroupTable, $rootScope, $modalInstance) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.GroupTableService = GroupTable;
    this.groupTables = groupTables;
    this.$modalInstance = $modalInstance;
    this.$rootScope = $rootScope;
    this.form_data = {
      color: '#ffffff',
      min: 0,
      max: 0,
    }
  }

  submitForm() {
    this.is_submitting = true;
    this.$rootScope.show_spinner = true;
    this.errors = [];

    const data = {
      color: this.form_data.color,
      min: this.form_data.min,
      max: this.form_data.max,
    };

    this.GroupTableService
      .create(this.current_company_id, data)
      .then(
        (groupTable) => {
          this.is_submitting = false;
          this.$rootScope.show_spinner = false;
          this.groupTables.push(groupTable);
          this.$modalInstance.dismiss('cancel');
        }, (error) => {
          this.is_submitting = false;
          this.$rootScope.show_spinner = false;
          this.errors = error.data.errors;
        });
  }
}
