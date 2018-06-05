export default class SettingsCtrl {
  constructor($state, $stateParams, $window, User) {
    'ngInject';

    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$window = $window;

    if (this.$state.current.name.indexOf('app.settings') >= 0 && !User.isOwnerOrManager()) {
      this.$state.go('app.dashboard');
    }

    this.pages = {
      'settings.general.title': 'app.settings.general',
      'settings.customer_settings_names.title': 'app.settings.customer_settings_names',
      'settings.mails.title': 'app.settings.mails',
      'settings.products.title': 'app.settings.products',
      'settings.limits.title': 'app.settings.limits',
      'settings.employees.title': 'app.settings.employees',
      'settings.tables.title': 'app.settings.tables',
      'settings.plugins.title': 'app.settings.plugins',
      'settings.warnings.title': 'app.settings.warnings',
      'settings.themes.title': 'app.settings.themes',
      'settings.lightspeed.title': 'app.settings.lightspeed',
    };
  }
}
