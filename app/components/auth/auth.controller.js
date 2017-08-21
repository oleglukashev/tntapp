class AuthCtrl {
  constructor(User, $state, $stateParams, $window) {
    'ngInject';

    this.User = User;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$window = $window;
    this.authType = $state.current.name.replace('auth.', '');
  }

  sendAuthForm(path) {
    this.isSubmitting = true;

    this.User.auth(path, this.formData).then(
      (result) => {
        this.$state.go('app.dashboard');
      },
      (error) => {
        this.isSubmitting = false;

        if (this.authType == 'login') {
          this.errors = error.data;
        } else if (this.authType == 'reset_password_finish') {
          if (error.data.message) {
            this.errors = [error.data];
          } else {
            this.errors = [error.data.error];
          }
        } else {
          this.errors = error.data.errors;
        }
      });
  }

  sendResetPasswordForm() {
    this.isSubmitting = true;

    this.User.resetPassword(this.formData).then(
      (result) => {
        this.isSubmitting = false;
        this.success      = true;
      },
      (error) => {
        this.isSubmitting = false;
      });
  }

  submitForm() {
    if (this.authType === 'reset_password') {
      this.sendResetPasswordForm();
    } else if (this.$state.current.name === 'auth_admin.login_via_admin') {
      this.User.authViaAdmin(this.$stateParams.token);
      this.$state.go('app.dashboard');
    } else {
      let path = '/authenticate_check';

      if (this.authType === 'register') {
        path = '/register';
      } else if (this.authType === 'reset_password_finish') {
        path = '/reset_password/' + this.$stateParams.id + '/' + this.$stateParams.token;
      }

      this.sendAuthForm(path);
    }
  }
}

export default AuthCtrl;
