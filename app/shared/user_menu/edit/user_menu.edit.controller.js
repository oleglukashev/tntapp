export default class UserMenuEditCtrl {
  constructor(User, Customer, customer, customerNotes, customerPreferences, customerAllergies,
    UserMenuEditFactroy, $rootScope, $modalInstance, moment, $modal) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.$rootScope = $rootScope;
    this.$modalInstance = $modalInstance;
    this.$modal = $modal;
    this.moment = moment;
    this.submited_success = false;

    this.note = {};

    this.date_options = {
      formatYear: 'yyyy',
      startingDay: 1,
      showWeeks: false,
      class: 'datepicker',
    };

    this.customer = customer;
    this.customerNotes = customerNotes;
    this.customerPreferences = customerPreferences;
    this.customerAllergies = customerAllergies;

    UserMenuEditFactroy(this);
  }

  closeModal() {
    this.$modalInstance.dismiss('cancel');
  }
}
