export default class EditUserMenuPreferencesCtrl {
  constructor(User, CustomerSettingsName, CustomerPreference, UserMenu, $rootScope, $translate) {
    'ngInject';

    this.currentCompanyId = User.getCompanyId();
    this.CustomerPreference = CustomerPreference;
    this.UserMenu = UserMenu;
    this.preferences = [];
    this.$rootScope = $rootScope;

    this.$onInit = () => {
      // load allergies and preferences
      CustomerSettingsName.getAll(this.currentCompanyId).then((result) => {
        result.forEach((item) => {
          if (item.language === $translate.proposedLanguage().toUpperCase() &&
            item.type === 'preference') {
            this.preferences.push(item.value);
          }
        });
      });
    };
  }

  delete(index) {
    this.$rootScope.show_spinner = true;

    this.CustomerPreference
      .delete(this.currentCompanyId, this.customer.id, this.customerPreferences[index].id)
      .then(() => {
        this.$rootScope.show_spinner = false;
        this.$rootScope.$broadcast('NewReservationCtrl.reload_reservations');
        this.customerPreferences.splice(index, 1);
        this.UserMenu.preferences = this.customerPreferences;
        this.item = null;
      }, () => {
        this.$rootScope.show_spinner = false;
      });
  }

  submitForm(form) {
    if (!form.$valid) {
      return false;
    }

    this.preferences_is_submitting = true;
    this.$rootScope.show_spinner = true;

    const data = {
      owner: this.item.owner,
      name: this.item.name,
      value: this.item.value,
    };

    if (this.item.id) {
      this.CustomerPreference.update(this.currentCompanyId, this.customer.id, this.item.id, data)
        .then(() => {
          this.item = null;
          this.UserMenu.preferences = this.customerPreferences;
          this.$rootScope.$broadcast('NewReservationCtrl.reload_reservations');
          this.preferences_is_submitting = false;
          this.$rootScope.show_spinner = false;
          form.$setPristine();
          form.$setUntouched();
          this.dismiss({ $value: 'cancel' });
        }, () => {});
    } else {
      this.CustomerPreference.create(this.currentCompanyId, this.customer.id, data)
        .then((result) => {
          this.item = null;
          this.customerPreferences.push(result);
          this.UserMenu.preferences = this.customerPreferences;
          this.$rootScope.$broadcast('NewReservationCtrl.reload_reservations');
          this.preferences_is_submitting = false;
          this.$rootScope.show_spinner = false;
          form.$setPristine();
          form.$setUntouched();
          this.dismiss({ $value: 'cancel' });
        }, () => {});
    }
  }

  searchPreference(query, defaultScope) {
    if (query) {
      return defaultScope
        .filter(item => item.toLowerCase().indexOf(query.toLowerCase()) >= 0);
    }

    return defaultScope;
  }
}
