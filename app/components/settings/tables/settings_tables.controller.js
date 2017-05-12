import angular from 'angular';

export default class SettingsTablesCtrl {
  constructor(Zone, Settings) {
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
    let data    = { tables: this.form_data };
    
    this.Settings
      .updateTablesSettings(data)
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
          
          //this.setFormData(tables);
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
    let last_position      = Math.max.apply(Math, this.form_data.map((item) => item.position));
    let last_table_number  = Math.max.apply(Math, this.form_data.map((item) => item.table_number));
    
    this.form_data.push({
      table_number      : last_table_number + 1,
      number_of_persons : 1,
      position          : last_position + 1,
      zones             : []
    });

    this.submitForm();
  }

  getTableNumberNameByIndex(index) {
    return 'table_number_' + index;
  }

  // setFormData(table) {
  //   let that = this;
  //   that.form_data = [];

  //   angular.forEach(tables, (table) => {
  //     that.form_data.push({
  //       table_number: table.table_number
  //     })
  //   })
  // }
}