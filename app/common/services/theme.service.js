export default class Theme {
  constructor(AppConstants, $window) {
    'ngInject';

    this.AppConstants = AppConstants;
    this.$window = $window;
  }

  save(name) {
    this.$window.localStorage.setItem('theme', name);
  }

  remove() {
    this.$window.localStorage.removeItem('theme');
  }

  get() {
    const theme = this.$window.localStorage.getItem('theme');

    if (!theme || theme === 'null') {
      return this.AppConstants.defaultThemeClass;
    }

    return theme;
  }
}
