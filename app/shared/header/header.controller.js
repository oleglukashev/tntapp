export default class HeaderCtrl {
  constructor(User, $state, $timeout, $mdSidenav) {
    'ngInject';

    this.$state = $state;
    this.$timeout = $timeout;
    this.$mdSidenav = $mdSidenav;
    this.User = User;
    this.current_user = User.current;
    this.current_company = User.current_company;
    this.current_company_id = User.getCompanyId();

    this.logout = User.logout.bind(User);
    this.userIsOwner = User.isOwner.bind(User);
  }

  hideRightSidebar() {
    this.$mdSidenav('right').close();
  }

  uploadPhoto(file, errFiles) {
    if (file) {
      this.User.uploadPhoto(this.User.current.id, file).then((response) => {
        this.User.current.photo = response.data.photo;
      }, (response) => {
        if (response.status > 0) this.upload_photo_error = response.status;
      });
    }

    if (errFiles[0]) {
      this.upload_photo_error = '';
      this.upload_photo_error = `${errFiles[0].$error} ${errFiles[0].$errorParam}`;
    }
  }

  setDefaultCompany(id) {
    this.User.setDefaultCompany(id);
    this.$state.reload();
  }

  isActiveState(state) {
    return this.$state.current.name === state;
  }

  isDiactiveState() {
    const states = [
      'app.dashboard',
      'app.reservations',
      'app.agenda',
      'app.profiles',
    ];

    return !states.includes(this.$state.current.name);
  }
}
