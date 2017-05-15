import angular from 'angular';

export default class SettingsTablesCtrl {
  constructor(Zone, Settings, filterFilter, $scope, $window, $modal) {
    'ngInject';

    this.Settings     = Settings;
    this.Zone         = Zone;
    this.filterFilter = filterFilter;
    this.$modal       = $modal;
    this.is_loaded    = false;
    this.form_data    = [];
    this.errors       = [];

    this.loadZonesAndTables();
  }

  submitForm() {
    this.errors = [];

    angular.forEach(this.form_data, (item, index) => {
      item.position = index;
    });

    this.Settings
      .updateTablesSettings({ tables: this.form_data })
        .then((tables) => {
        }, 
        (error) => {
          this.errors = error.data.errors;
        });
  }

  loadTables() {
    this.Settings
      .getTablesSettings()
        .then(
          (tables) => {
            this.is_loaded      = true;
            this.form_data      = tables.map((item) => {
              return {
                table_number      : parseInt(item.table_number),
                number_of_persons : parseInt(item.number_of_persons),
                position          : parseInt(item.position),
                zones             : item.zones
              }
            });
          });
  }

  loadZonesAndTables() {
    this.Zone.getAll()
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

  removeZone() {
    
  }

  addTable() {
    let last_position      = this.form_data.length ? Math.max.apply(Math, this.form_data.map((item) => item.position)) : null;
    let last_table_number  = this.form_data.length ? Math.max.apply(Math, this.form_data.map((item) => item.table_number)) : null;

    let position           = last_position ? last_position + 1 : 0;
    let table_number       = last_table_number ? last_table_number + 1 : 1;
    
    this.form_data.push({
      table_number      : table_number,
      number_of_persons : 0,
      position          : position,
      zones             : []
    });

    this.submitForm();
  }

  removeTable(index) {
    let table = this.form_data[index];

    if (table) {
      this.form_data.splice(index, 1);
    }

    this.submitForm();
  }

  getTableNumberNameByIndex(index) {
    return 'table_number_' + index;
  }
}