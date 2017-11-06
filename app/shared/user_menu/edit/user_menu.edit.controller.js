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

    this.customer = this.$rootScope.customer;

    this.date_options = {
      formatYear: 'yyyy',
      startingDay: 1,
      showWeeks: false,
      class: 'datepicker',
    };

    this.customerNotes = this.$rootScope.customer_notes;
    this.customerPreferences = this.$rootScope.customer_preferences;
    this.customerAllergies = this.$rootScope.customer_allergies;

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
