export default function NewReservationPersonPreferencesFactory() {
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

    instance.default_allergies = [
      'glutenfree',
      'lactose_free',
      'tree_nuts_allergy',
      'peanut_allergy',
      'egg_allergy',
      'shellfish_allergy',
      'vegetarian',
      'vegan',
    ];

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

    instance.preferenceIsValid = (index) => {
      return instance.preference_data.owner && instance.preference_data.name && instance.preference_data.value;
    };

    instance.allergyIsValid = (index) => {
      return instance.allergy_data.owner && instance.allergy_data.allergy;
    };
  };
}
