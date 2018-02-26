export default class SettingsTablesNewZoneCtrl {
  constructor(User, Zone, SettingsTablesZoneFactory, zones, $rootScope, $modalInstance) {
    'ngInject';

    this.current_company_id = User.getCompanyId();

    this.ZoneService = Zone;
    this.zonesList = zones;
    this.$rootScope = $rootScope;
    this.$modalInstance = $modalInstance;
    this.item = {};

    SettingsTablesZoneFactory(this);
  }

  submitForm() {
    this.is_submitting = true;
    this.$rootScope.show_spinner = true;
    this.errors = [];

    this.ZoneService
      .create(this.current_company_id, this.item)
      .then(
        (zone) => {
          this.is_submitting = false;
          this.$rootScope.show_spinner = false;
          this.zonesList.push(zone);
          this.$modalInstance.dismiss('cancel');
        },
        (error) => {
          this.is_submitting = false;
          this.$rootScope.show_spinner = false;
          this.errors = error.data.errors;
        });
  }

  isDisabled(zone) {
    return this.zonesNames().includes(zone);
  }
}
