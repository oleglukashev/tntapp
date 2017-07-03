export default class SettingsCtrl {
  constructor($state, $stateParams, $window) {
    'ngInject';

    this.$state             = $state;
    this.$stateParams       = $stateParams;
    this.$window            = $window;

    this.pages              = {
        'ALGEMEEN'                 : 'app.settings.general',
        'MAILS'                    : 'app.settings.mails',
        'OPENINGSTIJDEN/PRODUCTEN' : 'app.settings.products',
        'PLEKKEN VRIJHOUDEN'       : 'app.settings.limits',
        'TAFELS'                   : 'app.settings.tables',
        'PLUGINS'                  : 'app.settings.plugins',
        'MEDEWERKERS'              : 'app.settings.employees'
    };
  }
}