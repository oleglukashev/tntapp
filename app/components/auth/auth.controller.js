class AuthCtrl {
  constructor(User, $state) {
    'ngInject';

    this.User = User;
    this.$state = $state;
    this.authType = $state.current.name.replace('auth.', '');
  }

  submitForm() {
    this.isSubmitting = true;

    this.User.tryAuth(this.authType, this.formData).then(
      (result) => {
        this.$state.go('app.dashboard');
      },
      (error) => {
          this.isSubmitting = false;
          this.errors = error.data;
      });
  }
}

export default AuthCtrl;
