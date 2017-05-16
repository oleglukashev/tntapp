export default class ProfileCtrl {
  constructor(User, $scope, $mdSidenav) {
    'ngInject';

    this.User           = User;
    this.currentUser    = User.current;
    this.currentCompany = User.currentCompany;
    this.logout         = User.logout.bind(User);
    this.$scope         = $scope;
    this.$mdSidenav     = $mdSidenav;
  }

  openMenu() {
    this.$mdSidenav('left').open()
  }

  closeMenu() {
    this.$mdSidenav('left').close()
  }
}
