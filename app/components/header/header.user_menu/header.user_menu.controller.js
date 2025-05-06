export default class HeaderUserMenuCtrl {
  constructor(User, $state, $window, $mdSidenav, $translate) {
    'ngInject';

    this.$state = $state;
    this.$window = $window;
    this.$mdSidenav = $mdSidenav;
    this.$translate = $translate;
    this.User = User;
    this.logout = User.logout.bind(User);
  }

  hideRightSidebar() {
    this.$mdSidenav('right').close();
  }

  changeLang(lang) {
    this.$translate.use(lang);
    this.$window.location.reload();
  }

  setDefaultCompany(id) {
    this.User.setDefaultCompany(id);
    this.$state.reload();
  }
}
