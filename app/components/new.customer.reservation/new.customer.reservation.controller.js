export default class Controller {
  constructor(User, Settings, $stateParams, $state, $rootScope, $window) {
    'ngInject';

    this.Settings = Settings;
    this.$rootScope = $rootScope;
    this.$window = $window;
    this.pluginImageFileName = null;
    this.tabIndex = 0;
    this.$state = $state;

    if (this.isAlternativeUrl()) {
      if ($state.current.name === 'customer_reservation.alternative') {
        const params = {
          id: $stateParams.rid,
          date: $stateParams.date,
          aantal_personen: $stateParams.aantal_personen,
        };

        $state.go('customer_reservation.new', params);
      } else if ($state.current.name === 'customer_reservation.alternative_start') {
        const params = {
          id: $stateParams.id,
          date: $stateParams.date,
          aantal_personen: $stateParams.aantal_personen,
        };

        $state.go('customer_reservation.new', params);
      }

      return false;
    }

    this.$onInit = () => {
      this.Settings.getGeneralSettings($stateParams.id)
        .then((generalSettings) => {
          this.initGeneralSettings(generalSettings);
        });
    };
  }

  isAlternativeUrl() {
    return [
      'customer_reservation.alternative',
      'customer_reservation.alternative_start'
    ].includes(this.$state.current.name);
  }

  initGeneralSettings(generalSettings) {
    this.settings = generalSettings;

    if (generalSettings.plugin_image_file_name) {
      this.pluginImageFileName = generalSettings.plugin_image_file_name;
    }
  }

  getBackgroundStyles() {
    if (!this.showCustomBackground()) return null;
    return this.pluginImageFileName;
  }

  showCustomBackground() {
    return this.pluginImageFileName && this.tabIndex === 0;
  }
}
