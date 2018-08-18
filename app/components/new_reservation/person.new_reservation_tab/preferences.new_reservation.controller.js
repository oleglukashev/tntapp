export default class Controller {
  constructor(CustomerSettingsName, $translate) {
    'ngInject';

    this.allergies = [];
    this.preferences = [];

    this.$onChanges = () => {
      this.current_company_id = this.currentCompanyId;
      this.allergy_data = this.allergyData;
      this.preference_data = this.preferenceData;

      // load allergies and preferences
      if (!this.allergies.length && !this.preferences.length) {
        CustomerSettingsName.getAll(this.current_company_id).then((result) => {
          result.forEach((item) => {
            if (item.language === $translate.proposedLanguage().toUpperCase()) {
              if (item.type === 'allergy') {
                this.allergies.push(item.value);
              } else if (item.type === 'preference') {
                this.preferences.push(item.value);
              }
            }
          });
        });
      }
    };

    console.log(this);
  }

  removeAllergy(index) {
    this.reservation.allergies.splice(index, 1);
  }

  removePreference(index) {
    this.reservation.preferences.splice(index, 1);
  }

  searchPreferencesAndAllergies(query, defaultScope) {
    if (query) {
      return defaultScope
        .filter(item => item.toLowerCase().indexOf(query.toLowerCase()) >= 0);
    }

    return defaultScope;
  }
}
