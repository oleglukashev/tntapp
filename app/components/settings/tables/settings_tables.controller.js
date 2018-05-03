export default class SettingsTablesCtrl {
  constructor(User, Zone, Table, filterFilter, $scope, $rootScope, $window, $modal) {
    'ngInject';

    this.current_company_id = User.getCompanyId();

    this.Table = Table;
    this.Zone = Zone;
    this.filterFilter = filterFilter;
    this.$modal = $modal;
    this.$rootScope = $rootScope;
    this.$window = $window;
    this.is_loaded = false;
    this.tables_by_zone = {};
    this.errors = [];
    this.opened = [true];

    this.loadZonesAndTables();
    this.$rootScope.show_spinner = true;
  }

  submitForm() {
    const dataTableIds = [];
    const data = [];
    let index = 0;
    this.zones.forEach((zone) => {
      this.tables_by_zone[zone.id].forEach((table) => {
        if (!dataTableIds.includes(table.id)) {
          data.push({
            table_number: table.table_number,
            number_of_persons: table.number_of_persons,
            position: index,
            zones: [zone.id],
          });

          dataTableIds.push(table.id);
          index += 1;
        }
      });
    });

    this.errors = [];
    this.$rootScope.show_spinner = true;
    this.Table.save(this.current_company_id, { tables: data })
      .then(
        (tables) => {
          this.$rootScope.show_spinner = false;
          this.initTablesByZone(tables);
        },
        (error) => {
          this.$rootScope.show_spinner = false;
          this.errors = error.data.errors;
        });
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

  removeZone(index) {
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
      zones: [id],
    });

    this.submitForm();
  }

  removeTable(zoneId, index) {
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
        position: parseInt(table.position),
        zones: [ zoneId ],
      });
    });
  }
}
