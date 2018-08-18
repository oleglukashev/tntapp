export default class SettingsTablesEditTableGroupCtrl {
  constructor(tableGroup, tableGroups, tablesByZone, User, TableGroup, Table, $rootScope, $uibModalInstance) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.TableGroupService = TableGroup;
    this.Table = Table;
    this.tablesByZone = tablesByZone;
    this.form_data = tableGroup;
    this.$rootScope = $rootScope;
    this.$modalInstance = $uibModalInstance;
    this.tableGroups = tableGroups;
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
      .update(this.current_company_id, this.form_data.id, data)
      .then(
        (tableGroup) => {
          const index = this.getIndex(tableGroup.id);

          this.is_submitting = false;
          this.$rootScope.show_spinner = false;
          this.tableGroups.splice(index, 1, tableGroup);

          for (let zoneId in this.tablesByZone) {
            this.tablesByZone[zoneId].forEach((table, index) => {
              const tableIds = this.tablesByZone[zoneId][index].table_group_ids;

              if (tableGroup.table_ids.includes(table.id) && !tableIds.includes(tableGroup.id)) {
                tableIds.push(tableGroup.id);
              } else if (!tableGroup.table_ids.includes(table.id) && tableIds.includes(tableGroup.id)) {
                const indexOfId = tableIds.indexOf(table.id)
                tableIds.splice(indexOfId, 1);
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

  getIndex(tableGroupId) {
    let result = -1;

    this.tableGroups.forEach((tableGroup, index) => {
      if (tableGroupId === tableGroup.id) {
        result = index;
      }
    });

    return result;
  }
}
