export default class HeaderCtrl {
  constructor(User) {
    'ngInject';

    this.currentUser = User.current;
    this.logout = User.logout.bind(User);
  }
}
