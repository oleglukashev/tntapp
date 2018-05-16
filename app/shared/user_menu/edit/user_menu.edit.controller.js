import angular from 'angular';

export default class UserMenuEditCtrl {
  constructor(User, Customer, UserMenu, UserMenuEditFactroy, $rootScope,
    $modalInstance, moment, $modal) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.$rootScope = $rootScope;
    this.$modalInstance = $modalInstance;
    this.$modal = $modal;
    this.moment = moment;
    this.submited_success = false;
    this.UserMenu = UserMenu;

    this.note = {};

    this.date_options = {
      formatYear: 'yyyy',
      startingDay: 1,
      showWeeks: false,
      class: 'datepicker',
    };

    this.customer = angular.copy(this.UserMenu.customer);
    this.customerNotes = angular.copy(this.UserMenu.notes);
    this.customerPreferences = angular.copy(this.UserMenu.preferences);
    this.customerAllergies = angular.copy(this.UserMenu.allergies);

    UserMenuEditFactroy(this);
  }

  closeModal() {
    this.$modalInstance.dismiss('cancel');
  }
}
