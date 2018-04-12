export default class SettingsTablesEditGroupTableCtrl {
  constructor(groupTable, groupTables, User, GroupTable, $rootScope, $modalInstance) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.GroupTableService = GroupTable;

    this.form_data = groupTable;
    this.$rootScope = $rootScope;
    this.$modalInstance = $modalInstance;
    this.groupTables = groupTables;
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
      .update(this.current_company_id, this.form_data.id, data)
      .then(
        (groupTable) => {
          const index = this.getIndex(groupTable.id);

          this.is_submitting = false;
          this.$rootScope.show_spinner = false;
          this.groupTables.splice(index, 1, groupTable);
          this.$modalInstance.dismiss('cancel');
        }, (error) => {
          this.is_submitting = false;
          this.$rootScope.show_spinner = false;
          this.errors = error.data.errors;
        });
  }

  getIndex(groupTableId) {
    let result = -1;

    this.groupTables.forEach((groupTable, index) => {
      if (groupTableId === groupTable.id) {
        result = index;
      }
    });

    return result;
  }
}
