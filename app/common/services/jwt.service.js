export default class JWT {
  constructor(AppConstants, $window) {
    'ngInject';

    this.AppConstants = AppConstants;
    this.$window = $window;
  }

  save(hash) {
    this.$window.localStorage.setItem(this.AppConstants.jwtKey, hash.token);
    this.$window.localStorage.setItem(this.AppConstants.jwtRefresh, hash.refresh_token);
  }

  get() {
    return this.$window.localStorage.getItem(this.AppConstants.jwtKey);
  }

  getRefreshToken() {
    return this.$window.localStorage.getItem(this.AppConstants.jwtRefresh);
  }

  destroy() {
    this.$window.localStorage.removeItem(this.AppConstants.jwtKey);
    this.$window.localStorage.removeItem(this.AppConstants.jwtRefresh);
  }

}
