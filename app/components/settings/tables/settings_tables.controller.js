import angular from 'angular';

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
    const data = this.getScopeTables().map((item, index) => {
      return {
        table_number: item.table_number,
        number_of_persons: item.number_of_persons,
        position: index,
        zones: item.zones,
      };
    });

    this.errors = [];
    this.$rootScope.show_spinner = true;
    this.Table.save(this.current_company_id, { tables: data })
      .then(
        () => {
          this.$rootScope.show_spinner = false;
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

          angular.forEach(this.zones, (zone) => {
            this.tables_by_zone[zone.id] = this.filterFilter(tables, { zones: zone.id }).map((item) => {
              return {
                id: item.id,
                table_number: item.table_number,
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
        },
        () => {
        });
  }

  addZone() {
    const that = this;
    const modalInstance = this.$modal.open({
      templateUrl: 'settings_tables.new_zone.view.html',
      controller: 'SettingsTablesNewZoneCtrl as new_zone',
      size: 'md',
      resolve: {
        zones: () => that.zones,
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
          },
          () => {
            this.$rootScope.show_spinner = false;
          });
    }
  }

  addTableByZoneId(id) {
    const scopeTables = this.getScopeTables();
    const lastPosition = scopeTables.length ?
      Math.max.apply(Math, scopeTables.map(item => item.position)) :
      null;

    const lastTableNumber = scopeTables.length ?
      Math.max.apply(Math, scopeTables.map(item => item.table_number)) :
      null;

    const position = lastPosition ? lastPosition + 1 : 0;
    const tableNumber = lastTableNumber || String(1);

    if (!this.tables_by_zone[id]) {
      this.tables_by_zone[id] = [];
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
    // need to find a normal alternative for angular forEach
    let index = -1;
    let keepGoing = true;

    angular.forEach(this.getScopeTables().sort((a, b) => a.position - b.position), (item) => {
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

    angular.forEach(this.tables_by_zone, (item) => {
      result = result.concat(item);
    });

    return result;
  }
}
