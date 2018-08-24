export default class DashboardIviteCtrl {
  constructor(User, Invite, $rootScope) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Invite = Invite;
    this.$rootScope = $rootScope;
    this.is_submitting = false;
    this.$rootScope.show_spinner = false;

    this.$onInit = () => {
    };
  }

  submitForm(isValid) {
    if (!isValid) {
      return false;
    }

    this.is_submitting = true;
    this.$rootScope.show_spinner = true;

    this.Invite.send(this.current_company_id, this.form_data).then(() => {
      this.is_submitting = false;
      this.$rootScope.show_spinner = false;
      this.dismiss({ $value: 'cancel' });
    }, () => {
      this.is_submitting = false;
      this.$rootScope.show_spinner = false;
    });

    return null;
  }
}
