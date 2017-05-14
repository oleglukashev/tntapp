import angular from 'angular';

export default class SettingsTablesCtrl {
  constructor(Zone, Settings, $scope, $window) {
    'ngInject';

    this.Settings  = Settings;
    this.Zone      = Zone;
    this.is_loaded = false;
    this.form_data = [];
    this.errors    = [];

    this.loadZonesAndTables();
  }

  submitForm() {
    this.errors = [];
    
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
            this.is_loaded    = true;
            this.form_data    = tables.map((item) => {
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

  getTableNumberNameByIndex(index) {
    return 'table_number_' + index;
  }

  callback() {
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
}