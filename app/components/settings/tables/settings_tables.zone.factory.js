export default function SettingsTablesZoneFactory(AppConstants) {
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

    const loadedZones = instance.zonesHash();
    if (loadedZones) instance.iconsClasses = $.extend(loadedZones, instance.iconsClasses);
    instance.uniq_icons = [...new Set(Object.values(instance.iconsClasses))];
  };
}
