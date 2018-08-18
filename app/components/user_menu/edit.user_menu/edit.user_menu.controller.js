import angular from 'angular';

export default class Controller {
  constructor(Customer, UserMenu, AppConstants, $rootScope, moment, $state) {
    'ngInject';

    this.$rootScope = $rootScope;
    this.$state = $state;
    this.moment = moment;
    this.submited_success = false;
    this.UserMenu = UserMenu;
    this.AppConstants = AppConstants;

    this.note = {};

    this.customer = angular.copy(this.UserMenu.customer);
    this.customerNotes = angular.copy(this.UserMenu.notes);
    this.customerPreferences = angular.copy(this.UserMenu.preferences);
    this.customerAllergies = angular.copy(this.UserMenu.allergies);
  }
}
