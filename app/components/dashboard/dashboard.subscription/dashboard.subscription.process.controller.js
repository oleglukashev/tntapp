export default class SubscriptionProcessCtrl {
  constructor($modalInstance, $rootScope, Invite, iban) {
    'ngInject';

    this.$rootScope = $rootScope;
    this.$modalInstance = $modalInstance;
    this.Invite = Invite;
    this.iban = iban;
    this.show_form = false;
    this.is_submitting = false;
    this.$rootScope.show_spinner = false;
  }

  submitForm(isValid) {
    if (!isValid) {
      return false;
    }

    this.is_submitting = true;
    this.$rootScope.show_spinner = true;

    this.Invite.send(this.form_data).then(() => {
      this.is_submitting = false;
      this.$rootScope.show_spinner = false;
      this.$modalInstance.dismiss('cancel');
    }, () => {
      this.is_submitting = false;
      this.$rootScope.show_spinner = false;
    });
  }
}
