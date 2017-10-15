export default class HeaderCtrl {
  constructor(User, $state, $timeout) {
    'ngInject';

    this.$state = $state;
    this.$timeout = $timeout;
    this.User = User;
    this.current_user = User.current;
    this.current_company = User.current_company;
    this.current_company_id = User.getCompanyId();
    this.logout = User.logout.bind(User);
    this.photoPath = `${API_URL}../../../upload/user-photos/`;
    this.userPhotoURI = `${this.photoPath}${this.User.current.photo}?`;
    this.loadPhoto();
  }

  loadPhoto() {
    this.User.getPhoto(this.User.current.id).then((response) => {
      this.user_avatar = response;
    });
  }

  uploadPhoto(file, errFiles) {
    if (file) {
      this.User.uploadPhoto(this.User.current.id, file).then((response) => {
        this.$timeout(() => {
          file.result = response.data;
          this.User.update().then(() => {
            this.loadPhoto();
          });
        });
      }, (response) => {
        if (response.status > 0)
          this.upload_photo_error = response.status;
      }, (evt) => {
        // Math.min is to fix IE which reports 200% sometimes
        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
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
