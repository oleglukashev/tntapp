export default class SettingsCtrl {
  constructor($state, $stateParams, $window, User) {
    'ngInject';

    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$window = $window;

    if (this.$state.current.name.indexOf('app.settings') >= 0 && !User.isOwner()) {
      this.$state.go('app.dashboard');
    }

    this.pages = {
      'ALGEMEEN': 'app.settings.general',
      'MAILS': 'app.settings.mails',
      'OPENINGSTIJDEN/PRODUCTEN': 'app.settings.products',
      'PLEKKEN VRIJHOUDEN': 'app.settings.limits',
      'MEDEWERKERS': 'app.settings.employees',
      'TAFELS/ZONES': 'app.settings.tables',
      'PLUGINS': 'app.settings.plugins',
      'WARNINGS': 'app.settings.warnings',
      "KLEUREN THEMA'S": 'app.settings.themes',
    };
  }
}
