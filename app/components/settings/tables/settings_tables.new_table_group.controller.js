export default class SettingsTablesNewTableGroupCtrl {
  constructor(tableGroups, tablesByZone, User, TableGroup, $rootScope, $uibModalInstance) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.TableGroupService = TableGroup;
    this.tableGroups = tableGroups;
    this.tablesByZone = tablesByZone;
    this.$modalInstance = $uibModalInstance;
    this.$rootScope = $rootScope;
    this.form_data = {
      color: '#ffffff',
      min: 1,
      max: 1,
      table_ids: [],
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
      tables: this.form_data.table_ids,
    };

    this.TableGroupService
      .create(this.current_company_id, data)
      .then(
        (tableGroup) => {
          this.is_submitting = false;
          this.$rootScope.show_spinner = false;
          this.tableGroups.push(tableGroup);
          for (let zoneId in this.tablesByZone) {
            this.tablesByZone[zoneId].forEach((table, index) => {
              const tableIds = this.tablesByZone[zoneId][index].table_group_ids;

              if (tableGroup.table_ids.includes(table.id) && !tableIds.includes(tableGroup.id)) {
                tableIds.push(tableGroup.id);
              }
            });
          }
          this.$modalInstance.dismiss('cancel');
        }, (error) => {
          this.is_submitting = false;
          this.$rootScope.show_spinner = false;
          this.errors = error.data.errors;
        });
  }
}
