export default class JWT {
  constructor(AppConstants, $window) {
    'ngInject';

    this.AppConstants = AppConstants;
    this.$window = $window;
  }

  save(token) {
    this.$window.localStorage.setItem(this.AppConstants.jwtKey, token);
  }

  get() {
    return this.$window.localStorage.getItem(this.AppConstants.jwtKey);
  }

  destroy() {
    this.$window.localStorage.removeItem(this.AppConstants.jwtKey);
  }

}
