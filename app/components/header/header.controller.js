export default class HeaderCtrl {
  constructor(User, Notification, $state, $mdSidenav) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.$state = $state;
    this.$mdSidenav = $mdSidenav;
    this.User = User;
    this.Notification = Notification;
    this.userIsManager = User.isManager.bind(User);
  }

  openMobileMenu() {
    this.$mdSidenav('left').open();
  }

  hideRightSidebar() {
    this.$mdSidenav('right').close();
  }

  uploadPhoto(file, errFiles) {
    if (file) {
      this.User.uploadPhoto(this.current_company_id, file).then((response) => {
        this.User.current.photo = response.data.photo;
      }, (response) => {
        if (response.status > 0) this.upload_photo_error = response.status;
      });
    }

    if (errFiles[0]) {
      this.Notification.setText(`${errFiles[0].$error} ${errFiles[0].$errorParam}`);
    }
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
