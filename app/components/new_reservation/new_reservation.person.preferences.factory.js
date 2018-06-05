export default function NewReservationPersonPreferencesFactory(CustomerSettingsName, $translate) {
  'ngInject';

  return (that) => {
    const instance = that;

    instance.allergy_data = {
      owner: null,
      allergy: null,
    };

    instance.preference_data = {
      owner: null,
      name: null,
      value: null,
    };

    instance.addAllergy = () => {
      instance.reservation.allergies.push(instance.allergy_data);

      instance.allergy_data = {
        owner: null,
        allergy: null,
      };
    };

    instance.addPreference = () => {
      instance.reservation.preferences.push(instance.preference_data);

      instance.preference_data = {
        owner: null,
        name: null,
        value: null,
      };
    };

    instance.removeAllergy = (index) => {
      instance.reservation.allergies.splice(index, 1);
    };

    instance.removePreference = (index) => {
      instance.reservation.preferences.splice(index, 1);
    };

    instance.preferenceIsValid = () =>
      instance.preference_data.owner && instance.preference_data.name && instance.preference_data.value;

    instance.allergyIsValid = () => instance.allergy_data.owner && instance.allergy_data.allergy;

    instance.searchPreferncesAndAllergies = (query, defaultScope) => {
      if (query) {
        return defaultScope
          .filter(item => item.toLowerCase().indexOf(query.toLowerCase()) >= 0);
      }

      return defaultScope;
    };

    instance.allergies = [];
    instance.preferences = [];

    // load allergies and preferences
    CustomerSettingsName.getAll(instance.current_company_id).then((result) => {
      result.forEach((item) => {
        if (item.language === $translate.proposedLanguage().toUpperCase()) {
          if (item.type === 'allergy') {
            instance.allergies.push(item.value);
          } else if (item.type === 'preference') {
            instance.preferences.push(item.value);
          }
        }
      });
    });
  };
}
