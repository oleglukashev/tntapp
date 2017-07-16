import angular from 'angular';

export default class SettingsTablesCtrl {
  constructor(User, Zone, Table, filterFilter, $scope, $window, $modal) {
    'ngInject';

    this.current_company = User.current_company;

    this.Table          = Table;
    this.Zone           = Zone;
    this.filterFilter   = filterFilter;
    this.$modal         = $modal;
    this.$window        = $window;
    this.is_loaded      = false;
    this.tables_by_zone = {};
    this.errors         = [];
    this.opened         = [true];

    this.loadZonesAndTables();
  }

  submitForm() {
    this.errors = [];
    let data    = this.getScopeTables().map((item, index) => {
      return {
        table_number      : item.table_number,
        number_of_persons : item.number_of_persons,
        position          : index,
        zones             : item.zones
      }
    });

    this.Table
      .save(this.current_company.id, { tables: data })
        .then((tables) => {
        },
        (error) => {
          this.errors = error.data.errors;
        });
  }

  loadTables() {
    this.Table
      .getAll(this.current_company.id)
        .then(
          (tables) => {
            this.is_loaded      = true;

            angular.forEach(this.zones, (zone) => {
              this.tables_by_zone[zone.id] = this.filterFilter(tables, { zones: zone.id }).map((item) => {
                return {
                  id                : item.id,
                  table_number      : parseInt(item.table_number),
                  number_of_persons : parseInt(item.number_of_persons),
                  position          : parseInt(item.position),
                  zones             : item.zones
                }
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
          });
  }

  loadZonesAndTables() {
    this.Zone.getAll(this.current_company.id)
      .then(
        (result) => {
          this.zones = result;
          this.loadTables();
        },
        (error) => {
        });
  }

  addZone() {
    let that = this;
    let modalInstance = this.$modal.open({
      templateUrl: 'settings_tables.new_zone.view.html',
      controller: 'SettingsTablesNewZoneCtrl as new_zone',
      size: 'md',
      resolve: {
          zones: function () {
            return that.zones;
          }
        }
    });

    modalInstance.result.then((selectedItem) => {
      //success
    }, () => {
      // fail
    });
  }

  removeZone(index) {
    let zone = this.zones[index];

    if (zone) {
      this.Zone
        .delete(this.current_company.id, zone.id)
          .then(
            (result) => {
              delete this.tables_by_zone[zone.id];
              this.zones.splice(index, 1);
            },
            (error) => {
            });
    }
  }

  addTableByZoneId(id) {
    let scope_tables       = this.getScopeTables();
    let last_position      = scope_tables.length ? Math.max.apply(Math, scope_tables.map((item) => item.position)) : null;
    let last_table_number  = scope_tables.length ? Math.max.apply(Math, scope_tables.map((item) => item.table_number)) : null;

    let position           = last_position ? last_position + 1 : 0;
    let table_number       = last_table_number ? last_table_number + 1 : 1;

    if (!this.tables_by_zone[id]) {
      this.tables_by_zone[id] = [];
    }

    this.tables_by_zone[id].push({
      table_number      : table_number,
      number_of_persons : 0,
      position          : position,
      zones             : [id]
    });

    this.submitForm();
  }

  removeTable(zone_id, index) {
    let table = this.tables_by_zone[zone_id][index];

    if (table) {
      this.tables_by_zone[zone_id].splice(index, 1);
      this.submitForm();
    }
  }

  getTableNumberNameByZoneAndIndex(zone_id, index) {
    return 'table_number_' + zone_id + '_' + index;
  }

  getGlobalPosition(table) {
    //need to find a normal alternative for angular forEach
    let index      = -1;
    let keep_going = true;

    angular.forEach(this.getScopeTables().sort((a,b) => a.position - b.position), (item) => {
      if (keep_going) {
        index++;

        if (JSON.stringify(item) === JSON.stringify(table)) {
          keep_going = false;
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