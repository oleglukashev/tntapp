export default class Controller {
  constructor(User, $state, $stateParams, $window, $rootScope, $timeout, $http) {
    'ngInject';

    this.User = User;
    this.$state = $state;
    this.$http = $http;
    this.$stateParams = $stateParams;
    this.$window = $window;
    this.$timeout = $timeout;
    this.$rootScope = $rootScope;
    this.authType = $state.current.name.replace('auth.', '');
  }

  sendAuthForm(path) {
    this.isSubmitting = true;
    this.$rootScope.show_spinner = true;

    this.User.auth(path, this.formData).then(
      () => {
        this.$rootScope.show_spinner = false;
        this.User.verifyAuth(true).then((authValid) => {
          if (authValid === true) {
            this.$state.go('app.dashboard');
          }
        });
      },
      (error) => {
        this.isSubmitting = false;
        this.$rootScope.show_spinner = false;

        if (this.authType === 'login') {
          this.errors = error.data;
        } else {
          this.errors = error.data.errors;

          if (error.data.message) {
            this.errors = [error.data];
          }
        }
      });
  }

  sendResetPasswordForm() {
    this.isSubmitting = true;
    this.$rootScope.show_spinner = true;

    this.User.resetPassword(this.formData).then(
      () => {
        this.isSubmitting = false;
        this.$rootScope.show_spinner = false;
        this.success = true;
      },
      () => {
        this.$rootScope.show_spinner = false;
        this.isSubmitting = false;
      });
  }

  submitForm() {
    if (this.authType === 'reset_password') {
      this.sendResetPasswordForm();
    } else if (this.$state.current.name === 'auth_admin.login_via_admin') {
      this.User.authViaAdmin(this.$stateParams.token);
      this.User.verifyAuth(true).then((authValid) => {
        if (authValid === true) {
          this.$state.go('app.dashboard');
        }
      });
    } else {
      let path = '/authenticate_check';

      if (this.authType === 'register') {
        path = '/register';
      } else if (this.authType === 'reset_password_finish' || this.authType === 'activate') {
        path = `/reset_password/${this.$stateParams.id}/${this.$stateParams.token}`;
      }

      this.sendAuthForm(path);
    }
  }
}
