export default class DashboardIviteCtrl {
  constructor(User, Invite, $rootScope, $modalInstance) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Invite = Invite;
    this.$rootScope = $rootScope;
    this.$modalInstance = $modalInstance;
    this.is_submitting = false;
    this.$rootScope.is_loaded = false;
  }

  submitForm(isValid) {
    if (!isValid) {
      return false;
    }

    this.is_submitting = true;
    this.$rootScope.is_loaded = true;

    this.Invite.send(this.current_company_id, this.form_data).then(() => {
      this.is_submitting = false;
      this.$rootScope.is_loaded = false;
      this.$modalInstance.dismiss('cancel');
    }, () => {
      this.is_submitting = false;
      this.$rootScope.is_loaded = false;
    });
  }
}
