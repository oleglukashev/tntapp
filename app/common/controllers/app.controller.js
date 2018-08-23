export default class AppCtrl {
  constructor(Theme, $rootScope, Notification) {
    'ngInject';

    this.Notification = Notification;
    // this.$scope = $scope;
    this.Theme = Theme;
    this.$rootScope = $rootScope;
    //this.theme_class = Theme.get();

    // $scope.$on('AppCtrl.change_plugin_theme_name', (event) => {
    //   this.theme_class = this.Theme.get();
    // });
  }
}
