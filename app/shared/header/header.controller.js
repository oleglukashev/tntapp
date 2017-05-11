export default class HeaderCtrl {
  constructor(User, $state) {
    'ngInject';

    this.$state           = $state;

    this.User             = User;
    this.current_user     = User.current;
    this.current_company  = User.current_company;
    this.logout           = User.logout.bind(User);
  }

  setDefaultCompany(id) {
    this.User.setDefaultCompany(id);
    this.$state.reload();
  }
}
