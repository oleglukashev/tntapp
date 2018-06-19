import angular from 'angular';
import authTemplate from './settings_lightspeed.auth.view.html';

export default class SettingsLightspeedCtrl {
  constructor(User, Table, Settings, Lightspeed, $modal, $rootScope, $mdDialog) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Table = Table;
    this.Settings = Settings;
    this.Lightspeed = Lightspeed;
    this.$rootScope = $rootScope;
    this.$modal = $modal;
    this.$mdDialog = $mdDialog;

    this.lightspeed_tables = {};
    this.$rootScope.show_spinner = true;
    this.loadGeneralSettings();
    this.loadTables();
    this.loadLightspeedTables();
  }

  submitForm() {
    this.$rootScope.show_spinner = true;

    const data = {
      lightspeed_username: this.lightspeed_username,
      lightspeed_password: this.lightspeed_password,
    };

    this.Settings
      .updateGeneralSettings(this.current_company_id, data).then(
        () => {
          this.$rootScope.show_spinner = false;
        }, (error) => {
          this.errors = error.data;
        });
  }

  loadLightspeedTables() {
    this.lightspeed_tables = {};

    return this.Lightspeed.getAllTables(this.current_company_id).then((result) => {
      result.forEach((table) => {
        this.lightspeed_tables[table.name] = {
          id: parseInt(table.id),
          floorId: table.floorId,
          name: table.name,
          seats: table.seats,
        };
      });

      this.$rootScope.show_spinner = false;
    }, () => {
      this.$rootScope.show_spinner = false;
    });
  }

  sync() {
    this.loadLightspeedTables().then(() => {
      const tntTablesNames = this.tables.map(table => table.table_number);
      const lightspeedTablesNames = Object.keys(this.lightspeed_tables);

      if (!Object.keys(this.lightspeed_tables).length) {
        const alert = this.$mdDialog
          .alert()
          .title('Lightspeed sync error')
          .textContent('Please, check Lightspeed connection')
          .ok('Ok');

        this.$mdDialog.show(alert).then(() => {}, () => {});
      } else if (!angular.equals(tntTablesNames, lightspeedTablesNames)) {
        const alert = this.$mdDialog
          .alert()
          .title('Lightspeed sync warning')
          .textContent("Some tables can't be sync. Please, check lightspeed and TNT tables")
          .ok('Ok');

        this.$mdDialog.show(alert).then(() => {}, () => {});
      }

      this.tables.forEach((table, index) => {
        if (this.lightspeed_tables[table.table_number]) {
          this.tables[index].lightspeed_table_id = this.lightspeed_tables[table.table_number].id;
        }
      });
    })

    
  }

  saveTables() {
    const lightspeedTablesValues = Object
      .keys(this.lightspeed_tables)
      .map(key => this.lightspeed_tables[key]);
    let data = {};

    this.tables.forEach((table) => {
      const currentLHTable = lightspeedTablesValues
        .filter(lightspeedTable => lightspeedTable.id === table.lightspeed_table_id)[0];

      data[table.id] = {
        lightspeed_table_id: currentLHTable ? parseInt(currentLHTable.id) : null,
        lightspeed_floor_id: currentLHTable ? currentLHTable.floorId : null,
      };
    });

    this.errors = [];
    this.$rootScope.show_spinner = true;
    this.Table.updateLightSpeedTableData(this.current_company_id, data)
      .then(() => {
        this.$rootScope.show_spinner = false;
      }, (error) => {
        this.$rootScope.show_spinner = false;
        this.errors = error.data.errors;
      });
  }

  showAuthPopup() {
    const modalInstance = this.$modal.open({
      template: authTemplate,
      controller: 'SettingsLightspeedAuthCtrl as lightspeed_auth',
      size: 'md',
    });

    modalInstance.result.then(() => {}, () => {});
  }

  loadTables() {
    this.Table.getAll(this.current_company_id)
      .then(
        (tables) => {
          this.tables = tables;
          this.$rootScope.show_spinner = false;
        }, () => {
          this.$rootScope.show_spinner = false;
        });
  }

  loadGeneralSettings() {
    this.Settings
      .getGeneralSettings(this.current_company_id).then(
        (generalSettings) => {
          this.settings = generalSettings;
        });
  }
}
