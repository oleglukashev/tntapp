export default class Controller {
  constructor(User, Settings, $stateParams, $state, $rootScope, $window) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Settings = Settings;
    this.$rootScope = $rootScope;
    this.$window = $window;

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
  }

  getBackgroundStyles() {
    if (!this.showCustomBackground()) return null;
    return this.settings.plugin_image_file_name;
  }

  showCustomBackground() {
    return this.settings && this.settings.plugin_image_file_name && this.tab_index === 0;
  }
}
