import toSnakeCase from 'to-snake-case';

export default class EditUserMenuAllergiesCtrl {
  constructor(User, AppConstants, CustomerSettingsName, CustomerAllergies, UserMenu,
    $rootScope, $translate) {
    'ngInject';

    this.currentCompanyId = User.getCompanyId();
    this.CustomerAllergies = CustomerAllergies;
    this.UserMenu = UserMenu;
    this.AppConstants = AppConstants;
    this.allergies = [];
    this.$rootScope = $rootScope;

    this.$onInit = () => {
      // load allergies and preferences
      CustomerSettingsName.getAll(this.currentCompanyId).then((result) => {
        result.forEach((item) => {
          if (item.language === $translate.proposedLanguage().toUpperCase() &&
            item.type === 'allergy') {
            this.allergies.push(item.value);
          }
        });
      });
    };
  }

  delete(index) {
    this.$rootScope.show_spinner = false;

    this.CustomerAllergies
      .delete(this.currentCompanyId, this.customer.id, this.customerAllergies[index].id)
      .then(() => {
        this.$rootScope.show_spinner = false;
        this.$rootScope.$broadcast('NewReservationCtrl.reload_reservations');
        this.customerAllergies.splice(index, 1);
        this.UserMenu.allergies = this.customerAllergies;
        this.item = null;
      }, () => {
        this.$rootScope.show_spinner = false;
      });
  }

  submitForm(form) {
    if (!form.$valid) {
      return false;
    }

    this.allergies_is_submitting = true;
    this.$rootScope.show_spinner = true;

    const data = {
      owner: this.item.owner,
      allergy: this.item.allergy,
    };

    if (this.item.id) {
      this.CustomerAllergies
        .update(this.currentCompanyId, this.customer.id, this.item.id, data)
        .then(() => {
          this.item = null;
          this.UserMenu.allergies = this.customerAllergies;
          this.$rootScope.$broadcast('NewReservationCtrl.reload_reservations');
          this.allergies_is_submitting = false;
          this.$rootScope.show_spinner = false;
          form.$setPristine();
          form.$setUntouched();
          this.dismiss({ $value: 'cancel' });
        }, () => {
          this.$rootScope.show_spinner = false;
        });
    } else {
      this.CustomerAllergies
        .create(this.currentCompanyId, this.customer.id, data)
        .then((result) => {
          this.item = null;
          this.customerAllergies.push(result);
          this.UserMenu.allergies = this.customerAllergies;
          this.$rootScope.$broadcast('NewReservationCtrl.reload_reservations');
          this.allergies_is_submitting = false;
          this.$rootScope.show_spinner = false;
          form.$setPristine();
          form.$setUntouched();
          this.dismiss({ $value: 'cancel' });
        }, () => {
          this.$rootScope.show_spinner = false;
        });
    }
  }

  searchAllergies(query, defaultScope) {
    if (query) {
      return defaultScope
        .filter(item => item.toLowerCase().indexOf(query.toLowerCase()) >= 0);
    }

    return defaultScope;
  }

  getAllergyClass(name) {
    return this.AppConstants.allergyClasses[toSnakeCase(name)];
  }
}
