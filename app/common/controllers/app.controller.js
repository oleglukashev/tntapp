export default class AppCtrl {
  constructor(User, $cookieStore, $scope) {
    'ngInject';

    this.$scope = $scope;
    this.$cookieStore = $cookieStore;
    this.theme_class = this.$cookieStore.get('theme') || 'default-theme';

    $scope.$on('AppCtrl.change_plugin_theme_name', (event, theme) => {
      this.theme_class = theme;
    });
  }
}
