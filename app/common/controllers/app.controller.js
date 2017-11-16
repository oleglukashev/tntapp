export default class AppCtrl {
  constructor($cookieStore, $scope, AppConstants) {
    'ngInject';

    this.$scope = $scope;
    this.$cookieStore = $cookieStore;
    this.default_class = AppConstants.defaultThemeClass;
    this.theme_class = this.$cookieStore.get('theme') || this.default_class;

    $scope.$on('AppCtrl.change_plugin_theme_name', (event, themeClass) => {
      this.theme_class = themeClass || this.default_class;
    });
  }
}
