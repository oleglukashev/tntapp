export default class SettingsTablesNewZoneCtrl {
  constructor(User, Zone, AppConstants, zones, $scope, $rootScope, $modalInstance) {
    'ngInject';

    this.current_company_id = User.getCompanyId();

    this.Zone = Zone;
    this.zones = zones;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$modalInstance = $modalInstance;
    this.iconsClasses = AppConstants.zonesClasses;
    this.emptyMdiClass = AppConstants.emptyClass;
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
    this.$rootScope.show_spinner = true;
    this.errors = [];

    this.Zone
      .create(this.current_company_id, this.item)
      .then(
        (zone) => {
          this.is_submitting = false;
          this.$rootScope.show_spinner = false;
          this.zones.push(zone);
          this.$modalInstance.dismiss('cancel');
        },
        (error) => {
          this.$rootScope.show_spinner = false;
          this.errors = error.data.errors;
        });
  }

  zonesNames() {
    return this.zones.map(item => item.name);
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
