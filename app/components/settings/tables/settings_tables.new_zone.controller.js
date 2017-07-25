export default class SettingsTablesNewZoneCtrl {
  constructor(User, Zone, AppConstants, zones, $scope, $modalInstance) {
    'ngInject';

    this.current_company = User.current_company;

    this.Zone = Zone;
    this.zones = zones;
    this.$scope = $scope;
    this.iconsClasses = AppConstants.zonesClasses;
    this.emptyMdiClass = AppConstants.emptyClass;
    this.$modalInstance = $modalInstance;
    this.item = {};

    const loadedZones = this.zonesHash();
    if (loadedZones) this.iconsClasses = $.extend(loadedZones, this.iconsClasses);
    this.uniq_icons = [...new Set(Object.values(this.iconsClasses))];
  }

  closeModal() {
    this.$modalInstance.close();
  }

  changeClass(className) {
    this.item.icon_class = className;
  }

  submitForm() {
    this.is_submitting = true;
    this.errors = [];

    this.Zone
      .create(this.current_company.id, this.item)
        .then((zone) => {
          this.is_submitting = false;
          this.zones.push(zone);
          this.$modalInstance.dismiss('cancel');
        },
        (error) => {
          this.errors = error.data.errors;
        });
  }

  zonesNames() {
    return this.zones.map((item) => {
      return item.name;
    });
  }

  zonesHash() {
    const zones = {};
    this.zones.map((item) => {
      zones[item.name] = (item.icon_class ? item.icon_class :
        this.iconsClasses[item.name]) || this.emptyMdiClass;
    });
    return zones;
  }
}
