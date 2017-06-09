export default class SettingsTablesNewZoneCtrl {
  constructor(User, Zone, zones, $scope, $modalInstance) {
    'ngInject';

    this.current_company = User.current_company;

    this.Zone          = Zone;
    this.zones         = zones;
    this.$scope        = $scope;
    this.default_zones = ['Bar', 'Meeting room', 'Lounge', 'Restaurant', 'Terras', 'Zaal'];
    this.icons_classes = {
      'Bar'          : 'mdi-martini',
      'Lounge'       : 'mdi-food',
      'Meeting room' : 'mdi-google-circles-communities',
      'Restaurant'   : 'mdi-silverware-variant',
      'Terras'       : 'mdi-beach',
      'Zaal'         : 'mdi-food-fork-drink'
    }
    this.empty_mdi_class = 'mdi-close';
    this.$modalInstance  = $modalInstance;
    this.item            = {};

    let loadedZones = this.zonesHash();
    if (loadedZones) this.icons_classes = $.extend(loadedZones, this.icons_classes)
  }

  changeClass(className) {
    this.item.class = className;
  }

  submitForm() {
    this.is_submitting = true;
    this.errors        = [];

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
    return this.zones.map((item) => item.name);
  }

  zonesHash() {
    let zones = {};
    this.zones.map((item) => {
      zones[item.name] = (item.class ? item.class : this.icons_classes[item.name]) || this.empty_mdi_class;
    });
    return zones;
  }
}