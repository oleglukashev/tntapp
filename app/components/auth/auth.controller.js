class AuthCtrl {
  constructor(User, $state) {
    'ngInject';

    this.User = User;
    this.$state = $state;
  }

  submitForm() {
    this.isSubmitting = true;

    this.User.attemptAuth(this.formData).then(
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
