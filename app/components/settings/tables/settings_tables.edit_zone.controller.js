import angular from 'angular';

export default class SettingsTablesEditZoneCtrl {
  constructor(User, Zone, SettingsTablesZoneFactory, zones, zone, $rootScope, $modalInstance) {
    'ngInject';

    this.current_company_id = User.getCompanyId();

    this.ZoneService = Zone;
    this.zonesList = zones;
    this.zoneItem = zone;
    this.$rootScope = $rootScope;
    this.$modalInstance = $modalInstance;
    this.item = {
      name: this.zoneItem.name,
      icon_class: this.zoneItem.icon_class,
      use_in_frontoffice_availability: this.zoneItem.use_in_frontoffice_availability,
    };

    this.defaultItem = angular.copy(this.item);
    this.add_name_is_opened = true;

    SettingsTablesZoneFactory(this);
  }

  submitForm() {
    this.is_submitting = true;
    this.$rootScope.show_spinner = true;
    this.errors = [];

    this.ZoneService
      .update(this.current_company_id, this.item, this.zoneItem.id)
      .then(
        (zone) => {
          const index = this.getIndex(zone.id);

          this.is_submitting = false;
          this.$rootScope.show_spinner = false;
          this.zonesList.splice(index, 1, zone);
          this.$modalInstance.dismiss('cancel');
        }, (error) => {
          this.is_submitting = false;
          this.$rootScope.show_spinner = false;
          this.errors = error.data.errors;
        });
  }

  isDisabled(zoneName) {
    return this.zonesNames().includes(zoneName) && zoneName !== this.defaultItem.name;
  }

  getIndex(zoneId) {
    let result = -1;

    this.zonesList.forEach((zone, index) => {
      if (zoneId === zone.id) {
        result = index;
      }
    });

    return result;
  }
}
