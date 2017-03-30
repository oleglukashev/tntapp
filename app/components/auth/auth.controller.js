class AuthCtrl {
  constructor(User, $state, $stateParams) {
    'ngInject';

    this.User = User;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.authType = $state.current.name.replace('auth.', '');

    if (this.authType === 'reset_password_finish') {
        this.formData = { user_up: { _token: this.$stateParams.token } };
    }
  }

  submitForm() {
    let path = '/authenticate_check';

    if (this.authType === 'register') {
      path = '/register';
    } else if (this.authType === 'reset_password') {
      path = '/reset_password';
    } else if (this.authType === 'reset_password_finish') {
      path = '/reset_password/' + this.$stateParams.id + '/' + this.$stateParams.token;
    }

    this.isSubmitting = true;

    this.User.tryAuth(path, this.formData).then(
      (result) => {
        this.success = true;

        if (this.authType != 'reset_password') {
          this.$state.go('app.dashboard');
        }
      },
      (error) => {
          this.isSubmitting = false;

          if (this.authType == 'login') {
              this.errors = error.data;
          } else if (this.authType == 'reset_password_finish') {
              this.errors = error.data.error;
          } else {
            this.errors = error.data.errors;
          }
      });
  }
}

export default AuthCtrl;
