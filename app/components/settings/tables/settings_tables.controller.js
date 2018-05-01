import angular from 'angular';
import tableGroupFormTemplate from './settings_tables.table_group_form.view.html';

export default class SettingsTablesCtrl {
  constructor(User, Zone, Table, TableGroup, filterFilter, $scope, $rootScope, $window, $modal) {
    'ngInject';

    this.current_company_id = User.getCompanyId();

    this.Table = Table;
    this.Zone = Zone;
    this.TableGroup = TableGroup;
    this.filterFilter = filterFilter;
    this.$modal = $modal;
    this.$rootScope = $rootScope;
    this.$window = $window;
    this.is_loaded = false;
    this.tables_by_zone = {};
    this.errors = [];
    this.opened = [true];

    this.loadZonesAndTables();
    this.loadTableGroups();
    this.$rootScope.show_spinner = true;
  }

  submitForm() {
    const dataTableIds = [];
    const data = [];
    this.zones.forEach((zone) => {
      this.tables_by_zone[zone.id].forEach((table) => {
        if (!dataTableIds.includes(table.id)) {
          const tableGroups = (table.table_group_ids.length === 1 && table.table_group_ids[0] === null)
            ? []
            : table.table_group_ids;

          data.push({
            table_number: table.table_number,
            number_of_persons: table.number_of_persons,
            table_groups: tableGroups,
            position: table.position,
            zones: [zone.id],
          });

          dataTableIds.push(table.id);
        }
      });
    });

    this.errors = [];
    this.$rootScope.show_spinner = true;
    this.Table.save(this.current_company_id, { tables: data }).then((tables) => {
      this.initTablesByZone(tables);

      tables.forEach((table, index) => {
        this.tableGroups.forEach(($tableGroup) => {
          if ($tableGroup.table_ids.includes(table.id) && !table.table_group_ids.includes($tableGroup.id)) {
            const indexOfTable = $tableGroup.table_ids.indexOf(table.id);
            $tableGroup.table_ids.splice(indexOfTable, 1);
          } else if (!$tableGroup.table_ids.includes(table.id) && table.table_group_ids.includes($tableGroup.id)) {
            $tableGroup.table_ids.push(table.id);
          }
        });
      });

      this.$rootScope.show_spinner = false;
    }, (error) => {
      this.$rootScope.show_spinner = false;
      this.errors = error.data.errors;
    });
  }

  addZone() {
    const that = this;
    const modalInstance = this.$modal.open({
      templateUrl: 'settings_tables.zone.view.html',
      controller: 'SettingsTablesNewZoneCtrl as controller',
      size: 'md',
      resolve: {
        zones: () => that.zones,
      },
    });

    modalInstance.result.then(() => {}, () => {});
  }

  addTableGroup() {
    const modalInstance = this.$modal.open({
      template: tableGroupFormTemplate,
      controller: 'SettingsTablesNewTableGroupCtrl as controller',
      size: 'md',
      resolve: {
        tableGroups: () => this.tableGroups,
        tablesByZone: () => this.tables_by_zone,
      },
    });

    modalInstance.result.then(() => {}, () => {});
  }

  editZone(zone) {
    const that = this;
    const modalInstance = this.$modal.open({
      templateUrl: 'settings_tables.zone.view.html',
      controller: 'SettingsTablesEditZoneCtrl as controller',
      size: 'md',
      resolve: {
        zones: () => that.zones,
        zone: () => zone,
      },
    });

    modalInstance.result.then(() => {}, () => {});
  }

  editTableGroup(index) {
    const modalInstance = this.$modal.open({
      template: tableGroupFormTemplate,
      controller: 'SettingsTablesEditTableGroupCtrl as controller',
      size: 'md',
      resolve: {
        tableGroups: () => this.tableGroups,
        tableGroup: () => this.tableGroups[index],
        tablesByZone: () => this.tables_by_zone,
      },
    });

    modalInstance.result.then(() => {}, () => {});
  }

  deleteZone(index) {
    const zone = this.zones[index];
    this.$rootScope.show_spinner = true;

    if (zone) {
      this.Zone.delete(this.current_company_id, zone.id)
        .then(
          () => {
            this.$rootScope.show_spinner = false;
            delete this.tables_by_zone[zone.id];
            this.zones.splice(index, 1);
          }, () => {
            this.$rootScope.show_spinner = false;
          });
    }
  }

  deleteTableGroup(index) {
    const tableGroup = this.tableGroups[index];
    this.$rootScope.show_spinner = true;

    if (tableGroup) {
      this.TableGroup.delete(this.current_company_id, tableGroup.id)
        .then(() => {
          this.$rootScope.show_spinner = false;
          for (let zoneId in this.tables_by_zone) {
            this.tables_by_zone[zoneId].forEach((table, index) => {
              if (table.table_group_id === tableGroup.id) {
                this.tables_by_zone[zoneId][index].table_group_id = null;
              }
            });
          }
          this.tableGroups.splice(index, 1);
        }, () => {
          this.$rootScope.show_spinner = false;
        });
    }
  }

  addTableByZoneId(id) {
    const scopeTables = this.getScopeTables();
    if (!this.tables_by_zone[id]) {
      this.tables_by_zone[id] = [];
    }
    const zoneTables = this.tables_by_zone[id];
    const lastPosition = scopeTables.length ?
      Math.max.apply(Math, scopeTables.map(item => item.position)) :
      null;

    const lastTableNumber = zoneTables.length ?
      Math.max.apply(Math, zoneTables
        .filter((table) => parseInt(table.table_number) >= 0)
        .map(item => parseInt(item.table_number))) :
      null;

    const position = lastPosition ? lastPosition + 1 : 0;

    let tableNumber = String(1);
    if (lastTableNumber) {
      const lastNumericTableNumber = parseInt(lastTableNumber);

      if (lastNumericTableNumber >= 0) {
        tableNumber = lastNumericTableNumber + 1;
      } else {
        tableNumber = `${zoneTables[zoneTables.length - 1].table_number}2`;
      }
    }

    this.tables_by_zone[id].push({
      table_number: tableNumber,
      number_of_persons: 0,
      position,
      table_group_ids: [],
      zones: [id],
    });

    this.submitForm();
  }

  deleteTable(zoneId, index) {
    const table = this.tables_by_zone[zoneId][index];

    if (table) {
      this.tables_by_zone[zoneId].splice(index, 1);
      this.submitForm();
    }
  }

  getTableNumberNameByZoneAndIndex(zoneId, index) {
    return `table_number_${zoneId}_${index}`;
  }

  getGlobalPosition(table) {
    let index = -1;
    let keepGoing = true;
    const list = this.getScopeTables().sort((a, b) => a.position - b.position);

    list.forEach((item) => {
      if (keepGoing) {
        index += 1;

        if (JSON.stringify(item) === JSON.stringify(table)) {
          keepGoing = false;
        }
      }
    });

    return index;
  }

  getScopeTables() {
    let result = [];

    Object.keys(this.tables_by_zone).forEach((key) => {
      result = result.concat(this.tables_by_zone[key]);
    });

    return result;
  }

  loadTableGroups() {
    this.TableGroup.getAll(this.current_company_id).then((tableGroups) => {
      this.tableGroups = tableGroups;
    })
  }

  loadTables() {
    this.Table.getAll(this.current_company_id)
      .then(
        (tables) => {
          this.is_loaded = true;
          this.$rootScope.show_spinner = false;

          angular.forEach(this.zones, (zone) => {
            this.tables_by_zone[zone.id] = this.filterFilter(tables, { zones: zone.id }).map((item) => {
              return {
                id: item.id,
                table_number: item.table_number,
                group_table_id: item.group_table_id,
                number_of_persons: parseInt(item.number_of_persons),
                position: parseInt(item.position),
                zones: item.zones,
              };
            }).sort((a, b) => {
              let comparison = 0;

              if (a.position > b.position) {
                comparison = 1;
              } else if (b.position > a.position) {
                comparison = -1;
              }

              return comparison;
            });
          });
        }, () => {
          this.$rootScope.show_spinner = false;
        });
  }

  loadZonesAndTables() {
    this.Zone.getAll(this.current_company_id)
      .then(
        (result) => {
          this.zones = result;
          this.loadTables();
        }, () => {});
  }

  initTablesByZone(tables) {
    this.tables_by_zone = {};

    this.zones.forEach((zone) => {
      this.tables_by_zone[zone.id] = this.filterFilter(tables, { zones: zone.id }).map((item) => {
        return {
          id: item.id,
          table_number: item.table_number,
          table_group_ids: item.table_group_ids,
          number_of_persons: parseInt(item.number_of_persons),
          position: parseInt(item.position),
          zones: item.zones,
        };
      }).sort((a, b) => {
        let comparison = 0;

        if (a.position > b.position) {
          comparison = 1;
        } else if (b.position > a.position) {
          comparison = -1;
        }

        return comparison;
      });
    });
  }
}
