export default class HeaderCtrl {
  constructor(User, $state, $rootScope) {
    'ngInject';

    this.$state           = $state;
    this.$rootScope       = $rootScope;

    this.User             = User;
    this.current_user     = User.current;
    this.current_company  = User.current_company;
    this.logout           = User.logout.bind(User);

    switch(this.$state.current.name) {
      case 'app.dashboard': {
        this.selected_index = 0;
        break; 
      }
      case 'app.reservations': {
        this.selected_index = 1;
        break; 
      } 
    }
  }

  setDefaultCompany(id) {
    this.User.setDefaultCompany(id);
    this.$state.reload();
  }
}
