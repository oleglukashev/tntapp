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
    this.errors = {};
    this.opened = [true];

    this.loadZonesAndTables();
    this.loadTableGroups();
    this.$rootScope.show_spinner = true;
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

  addTable(zoneId) {
    const scopeTables = this.getScopeTables();

    if (!this.tables_by_zone[zoneId]) {
      this.tables_by_zone[zoneId] = [];
    }

    const zoneTables = this.tables_by_zone[zoneId];
    const lastPosition = scopeTables.length ?
      Math.max.apply(Math, scopeTables.map(item => item.position)) :
      null;

    let lastTableNumber = zoneTables.length ?
      Math.max.apply(Math, zoneTables
        .filter((table) => parseInt(table.table_number) >= 0)
        .map(item => parseInt(item.table_number))) :
      null;

    const position = lastPosition === null ? 0 : lastPosition + 1;

    if (!lastTableNumber) {
      lastTableNumber = scopeTables.length
        ? Math.max.apply(Math, scopeTables.map(table => table.table_number))
        : null;
    }

    let tableNumber = 1;
    if (lastTableNumber) {
      const lastNumericTableNumber = parseInt(lastTableNumber);

      if (lastNumericTableNumber >= 0) {
        tableNumber = lastNumericTableNumber + 1;
      } else {
        tableNumber = `${lastNumericTableNumber.table_number}2`;
      }
    }

    const data = {
      table_number: String(tableNumber),
      number_of_persons: 0,
      position,
      table_groups: [],
      zones: [zoneId],
    };
    const index = this.tables_by_zone[zoneId].length;
    this.tables_by_zone[zoneId].push(data);
    this.errors = {};
    this.Table.create(this.current_company_id, data).then((table) => {
      // insert id of new item
      this.tables_by_zone[zoneId][index].id = table.id;
    }, (error) => {
      if (!this.errors[zoneId]) {
        this.errors[zoneId] = {};
      }
      this.errors[zoneId][this.tables_by_zone[zoneId].length - 1] = error.data.errors.children;
    });
  }

  updateTable(zoneId, index) {
    const table = this.tables_by_zone[zoneId][index];

    if (table) {
      const data = {
        table_number: table.table_number,
        number_of_persons: table.number_of_persons,
        position: table.position,
        table_groups: table.table_group_ids,
        zones: table.zones,
      };

      this.errors = {};

      if (table.id) {
        this.Table.update(this.current_company_id, data, table.id)
          .then((table) => {
            this.tableGroups.forEach(($tableGroup) => {
              if ($tableGroup.table_ids.includes(table.id) && !table.table_group_ids.includes($tableGroup.id)) {
                const indexOfTable = $tableGroup.table_ids.indexOf(table.id);
                $tableGroup.table_ids.splice(indexOfTable, 1);
              } else if (!$tableGroup.table_ids.includes(table.id) && table.table_group_ids.includes($tableGroup.id)) {
                $tableGroup.table_ids.push(table.id);
              }
            });
          }, (error) => {
          if (!this.errors[zoneId]) {
            this.errors[zoneId] = {};
          }
          this.errors[zoneId][this.tables_by_zone[zoneId].length - 1] = error.data.errors.children;
        });
      } else {
        this.Table.create(this.current_company_id, data)
          .then((table) => {
            this.tables_by_zone[zoneId][index].id = table.id;
          }, (error) => {
            if (!this.errors[zoneId]) {
              this.errors[zoneId] = {};
            }
            this.errors[zoneId][this.tables_by_zone[zoneId].length - 1] = error.data.errors.children;
          });
      }
    }
  }

  deleteTable(zoneId, index) {
    const table = this.tables_by_zone[zoneId][index];

    if (table) {
      this.tables_by_zone[zoneId].splice(index, 1);
      this.Table.delete(this.current_company_id, table.id).then((tables) => {

      });
    }
  }

  updatePositions() {
    const data = {};
    let index = 0;
    
    this.zones.forEach((zone) => {
      if (this.tables_by_zone[zone.id]) {
        this.tables_by_zone[zone.id].forEach((table) => {
          if (table.id) {
            data[table.id] = index;
            index += 1;
          }
        });
      }
    });

    this.Table.updatePositions(this.current_company_id, data);
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
          this.initTablesByZone(tables);
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
    tables.forEach((table) => {
      let zoneId = table.zones[0];

      if (!this.tables_by_zone[zoneId]) {
        this.tables_by_zone[zoneId] = [];
      }

      let index = 0;
      this.tables_by_zone[zoneId].forEach((sortTable, sortIndex) => {
        if (parseInt(sortTable.position) < parseInt(table.position)) {
          index = sortIndex + 1;
        }
      });

      this.tables_by_zone[zoneId].splice(index, 0, {
        id: table.id,
        table_number: table.table_number,
        number_of_persons: parseInt(table.number_of_persons),
        table_group_ids: table.table_group_ids,
        position: parseInt(table.position),
        zones: [ zoneId ],
      });
    });
  }
}
