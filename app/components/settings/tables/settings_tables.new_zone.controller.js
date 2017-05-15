export default class SettingsTablesNewZoneCtrl {
  constructor(Zone, zones, $modalInstance) {
    'ngInject';

    this.Zone          = Zone;
    this.zones         = zones;
    this.default_zones = ['Bar', 'Restaurant', 'Terras', 'Zaal'];
    this.icons_classes = {
      'Bar'        : 'mdi-martini',
      'Restaurant' : 'mdi-food-fork-drink',
      'Terras'     : 'mdi-beach',
      'Zaal'       : 'mdi-food-fork-drink'
    }
    this.$modalInstance = $modalInstance;
  }

  submitForm() {
    this.is_submitting = true;
    this.errors        = [];

    this.Zone
      .create(this.item)
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
    return this.zones.map((item) => item.name);
  }
}