export default function UserMenuEditFactory(Customer, CustomerNote, CustomerPreference,
  CustomerAllergies, moment) {
  'ngInject';

  return (that) => {
    const instance = that;

    instance.deleteNote = (index) => {
      CustomerNote.delete(
        instance.current_company_id,
        instance.$rootScope.userData.id,
        instance.notes[index].id,
      ).then(
        () => {
          instance.notes.splice(index, 1);
          instance.note = null;
        }, () => {},
      );
    };

    instance.deletePreference = (index) => {
      CustomerPreference.delete(
        instance.current_company_id,
        instance.$rootScope.userData.id,
        instance.preferences[index].id,
      ).then(
        () => {
          instance.preferences.splice(index, 1);
          instance.preference = null;
        }, () => {},
      );
    };

    instance.deleteAllergy = (index) => {
      CustomerAllergies.delete(
        instance.current_company_id,
        instance.$rootScope.userData.id,
        instance.allergies[index].id,
      ).then(
        () => {
          instance.allergies.splice(index, 1);
          instance.allergy = null;
        }, () => {},
      );
    };

    instance.submitForm = (isValid) => {
      if (!isValid) {
        return false;
      }

      let userData = instance.$rootScope.userData;
      instance.is_submitting = true;

      if (userData.date_of_birth) {
        userData.date_of_birth = moment(userData.date_of_birth).format('DD-MM-YYYY');
      } else {
        userData.date_of_birth = null;
      }

      const data = {
        first_name: userData.first_name,
        last_name: userData.last_name,
        primary_phone_number: userData.primary_phone_number,
        secondary_phone_number: userData.secondary_phone_number,
        street: userData.street,
        house_number: userData.house_number,
        zipcode: userData.zipcode,
        city: userData.city,
        mail: userData.mail,
        date_of_birth: userData.date_of_birth,
        gender: userData.gender,
        averageRating: userData.average_rating,
      };

      Customer.edit(instance.current_company_id, userData.id, data).then(
        () => {
          userData = Object.assign(data, userData);
          instance.$rootScope.$broadcast('ProfilesCtrl.reload_customers');
          instance.$rootScope.$broadcast('NewReservationCtrl.reload_reservations');
          instance.is_submitting = false;
        }, () => {},
      );
    };

    instance.submitNoteForm = (isValid) => {
      if (!isValid) {
        return false;
      }

      instance.notes_is_submitting = true;

      const data = {
        note: instance.note.note,
      };

      if (instance.note.id) {
        CustomerNote.update(
          instance.current_company_id,
          instance.$rootScope.userData.id,
          instance.note.id,
          data,
        ).then(
          () => {
            instance.$rootScope.customer_notes = instance.notes;
            instance.note = {};
            instance.notes_is_submitting = false;
          }, () => {},
        );
      } else {
        CustomerNote.create(instance.current_company_id, instance.$rootScope.userData.id, data)
          .then(
            (result) => {
              instance.$rootScope.customer_notes.push(result);
              instance.note = {};
              instance.notes_is_submitting = false;
            }, () => {},
          );
      }
    };

    instance.submitPreferenceForm = (isValid) => {
      if (!isValid) {
        return false;
      }

      instance.preferences_is_submitting = true;

      const data = {
        name: instance.preference.name,
        value: instance.preference.value,
      };

      if (instance.preference.id) {
        CustomerPreference.update(
          instance.current_company_id,
          instance.$rootScope.userData.id,
          instance.preference.id,
          data,
        ).then(
          () => {
            instance.$rootScope.customer_preferences = instance.preferences;
            instance.preference = {};
            instance.preferences_is_submitting = false;
          }, () => {},
        );
      } else {
        CustomerPreference.create(instance.current_company_id, instance.$rootScope.userData.id, data)
          .then(
            (result) => {
              instance.$rootScope.customer_preferences.push(result);
              instance.preference = {};
              instance.preferences_is_submitting = false;
            }, () => {},
          );
      }
    };

    instance.submitAllergiesForm = (isValid) => {
      if (!isValid) {
        return false;
      }

      instance.allergies_is_submitting = true;

      const data = {
        allergy: instance.allergy.allergy,
      };

      if (instance.allergy.id) {
        CustomerAllergies.update(
          instance.current_company_id,
          instance.$rootScope.userData.id,
          instance.allergy.id,
          data,
        ).then(
          () => {
            instance.$rootScope.customer_allergies = instance.allergies;
            instance.allergy = {};
            instance.allergies_is_submitting = false;
          }, () => {},
        );
      } else {
        CustomerAllergies.create(instance.current_company_id, instance.$rootScope.userData.id, data)
          .then(
            (result) => {
              instance.$rootScope.customer_allergies.push(result);
              instance.allergy = {};
              instance.allergies_is_submitting = false;
            }, () => {},
          );
      }
    };
  };
}
