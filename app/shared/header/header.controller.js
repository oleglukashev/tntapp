export default class HeaderCtrl {
  constructor(User, $state, $timeout) {
    'ngInject';

    this.$state           = $state;
    this.$timeout         = $timeout;

    this.User             = User;
    this.current_user     = User.current;
    this.current_company  = User.current_company;
    this.current_company_id = User.getCompanyId();
    this.logout           = User.logout.bind(User);

    let states = {
      'app.dashboard'    : 0,
      'app.reservations' : 1,
      'app.agenda'       : 2,
      'app.profiles'     : 3
    }

    this.selected_index = states[this.$state.current.name];

    this.photoPath        = API_URL + '../../../upload/user-photos/';
    this.userPhotoURI     = this.photoPath + this.User.current.photo + '?';

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
      })
    }

    if (errFiles[0]) {
      this.upload_photo_error = ''
      this.upload_photo_error = errFiles[0].$error + ' ' +  errFiles[0].$errorParam;
    }
  }

  getCompanies() {
    let result = [];

    for (let company_data of this.current_user.company_roles) {
      result.push(company_data.company);
    }

    for (let company of this.current_user.owned_companies) {
      result.push(company);
    }

    return result;
  }

  setDefaultCompany(id) {
    this.User.setDefaultCompany(id);
    this.$state.reload();
  }
}
