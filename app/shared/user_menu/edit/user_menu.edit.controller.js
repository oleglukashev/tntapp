export default class UserMenuEditCtrl {
  constructor(User, Customer, UserMenuEditFactroy, $rootScope, $modalInstance, moment, $modal) {
    'ngInject';

    this.current_company_id = User.getCompanyId();

    this.$rootScope = $rootScope;
    this.$modalInstance = $modalInstance;
    this.$modal = $modal;
    this.moment = moment;
    this.submited_success = false;

    this.note = {};

    this.$rootScope.userData = this.$rootScope.customer;

    this.date_options = {
      formatYear: 'yyyy',
      startingDay: 1,
      showWeeks: false,
      class: 'datepicker',
    };

    this.notes = this.$rootScope.customer_notes;
    this.preferences = this.$rootScope.customer_preferences;
    this.allergies = this.$rootScope.customer_allergies;

    UserMenuEditFactroy(this);
  }

  closeModal() {
    this.$modalInstance.dismiss('cancel');
  }

  openNotesModal() {
    const modalInstance = this.$modal.open({
      templateUrl: 'user_menu.notes.view.html',
      controller: 'UserMenuNotesCtrl as user_notes',
      size: 'md',
    });

    modalInstance.result.then(() => {}, () => {});
  }
}
