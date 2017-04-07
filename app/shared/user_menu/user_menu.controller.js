export default class UserMenuCtrl {
  constructor(User, $scope) {
    'ngInject';

    this.User           = User;
    this.currentUser    = User.current;
    this.currentCompany = User.currentCompany;
    this.logout = User.logout.bind(User);

    $scope.$on('topic', function (event, arg) {
      alert(arg);
      $scope.receiver = 'got your ' + arg;
    });
  }
}
