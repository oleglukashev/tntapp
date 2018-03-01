export default function SettingsTablesZoneFactory(AppConstants, $translate) {
  'ngInject';

  return (that) => {
    const instance = that;

    instance.iconsClasses = AppConstants.zonesClasses;
    instance.emptyMdiClass = AppConstants.emptyClass;

    instance.closeModal = () => {
      instance.$modalInstance.close();
    };

    instance.changeClass = (className) => {
      instance.item.icon_class = className;
    };

    instance.zonesNames = () => instance.zonesList.map(item => item.name);

    instance.zonesHash = () => {
      const zones = {};
      instance.zonesList.forEach((item) => {
        zones[item.name] = (item.icon_class ? item.icon_class :
          instance.iconsClasses[item.name]) || instance.emptyMdiClass;
      });

      return zones;
    };

    // run translates
    $translate(Object.keys(instance.iconsClasses).map(item => `zones_examples.${item}`))
      .then((translates) => {
        const classes = {};
        classes[translates['zones_examples.bar']] = instance.iconsClasses.bar;
        classes[translates['zones_examples.lounge']] = instance.iconsClasses.lounge;
        classes[translates['zones_examples.meeting_room']] = instance.iconsClasses.meeting_room;
        classes[translates['zones_examples.restaurant']] = instance.iconsClasses.restaurant;
        classes[translates['zones_examples.terrace']] = instance.iconsClasses.terrace;
        classes[translates['zones_examples.hall']] = instance.iconsClasses.hall;
        instance.iconsClasses = classes;
        const loadedZones = instance.zonesHash();
        if (loadedZones) instance.iconsClasses = $.extend(loadedZones, instance.iconsClasses);
        instance.uniq_icons = [...new Set(Object.values(instance.iconsClasses))];
      });
  };
}
