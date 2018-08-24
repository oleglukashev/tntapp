export default class Controller {
  constructor(User, $mdSidenav) {
    'ngInject';

    this.User = User;
    this.currentUser = User.current;
    this.currentCompany = User.currentCompany;
    this.logout = User.logout.bind(User);
    this.$mdSidenav = $mdSidenav;
  }

  closeMenu() {
    this.$mdSidenav('left').close();
  }
}
