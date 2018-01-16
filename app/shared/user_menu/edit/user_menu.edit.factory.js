export default function UserMenuEditFactory(Customer, CustomerNote, CustomerPreference,
  CustomerAllergies, moment) {
  'ngInject';

  const resetForm = (form) => {
    form.$setPristine();
    form.$setUntouched();
  }

  return (that) => {
    const instance = that;

    instance.deleteNote = (index) => {
      instance.$rootScope.show_spinner = true;

      CustomerNote.delete(
        instance.current_company_id,
        instance.customer.id,
        instance.customerNotes[index].id,
      ).then(
        () => {
          instance.$rootScope.show_spinner = false;
          instance.customerNotes.splice(index, 1);
          instance.note = null;
        }, () => {
          instance.$rootScope.show_spinner = false;
        },
      );
    };

    instance.deletePreference = (index) => {
      instance.$rootScope.show_spinner = true;

      CustomerPreference.delete(
        instance.current_company_id,
        instance.customer.id,
        instance.customerPreferences[index].id,
      ).then(
        () => {
          instance.$rootScope.show_spinner = false;
          instance.customerPreferences.splice(index, 1);
          instance.preference = null;
        }, () => {
          instance.$rootScope.show_spinner = false;
        },
      );
    };

    instance.deleteAllergy = (index) => {
      instance.$rootScope.show_spinner = false;

      CustomerAllergies.delete(
        instance.current_company_id,
        instance.customer.id,
        instance.customerAllergies[index].id,
      ).then(
        () => {
          instance.$rootScope.show_spinner = false;
          instance.customerAllergies.splice(index, 1);
          instance.allergy = null;
        }, () => {
          instance.$rootScope.show_spinner = false;
        },
      );
    };

    instance.submitForm = (isValid, form) => {
      if (!isValid) {
        return false;
      }

      const customerClone = instance.customer;
      if (customerClone.date_of_birth) {
        customerClone.date_of_birth = moment(customerClone.date_of_birth).format('DD-MM-YYYY');
      } else {
        customerClone.date_of_birth = null;
      }

      instance.is_submitting = true;
      instance.$rootScope.show_spinner = true;
      const data = {
        first_name: customerClone.first_name,
        last_name: customerClone.last_name,
        primary_phone_number: customerClone.primary_phone_number,
        secondary_phone_number: customerClone.secondary_phone_number,
        street: customerClone.street,
        house_number: customerClone.house_number,
        zipcode: customerClone.zipcode,
        city: customerClone.city,
        mail: customerClone.mail,
        date_of_birth: customerClone.date_of_birth,
        gender: customerClone.gender,
        averageRating: customerClone.average_rating,
      };

      Customer.edit(instance.current_company_id, customerClone.id, data).then(
        () => {
          instance.is_submitting = false;
          instance.$rootScope.show_spinner = false;
          instance.$rootScope.customer = Object.assign(data, customerClone);
          instance.$rootScope.$broadcast('ProfilesCtrl.reload_customers');
          instance.$rootScope.$broadcast('NewReservationCtrl.reload_reservations');
        }, () => {
          instance.is_submitting = false;
          instance.$rootScope.show_spinner = false;
        },
      );
    };

    instance.submitNoteForm = (form) => {
      if (!form.$valid) {
        return false;
      }

      const data = {
        note: instance.note.note,
      };

      instance.notes_is_submitting = true;
      instance.$rootScope.show_spinner = true;
      if (instance.note.id) {
        CustomerNote.update(
          instance.current_company_id,
          instance.customer.id,
          instance.note.id,
          data,
        ).then(
          () => {
            instance.notes_is_submitting = false;
            instance.$rootScope.show_spinner = false;
            instance.$rootScope.customer_notes = instance.notes;
            instance.note = {};
          }, () => {
            instance.notes_is_submitting = false;
            instance.$rootScope.show_spinner = false;
          },
        );
      } else {
        CustomerNote.create(instance.current_company_id, instance.customer.id, data)
          .then(
            (result) => {
              instance.notes_is_submitting = false;
              instance.$rootScope.show_spinner = false;
              instance.$rootScope.customer_notes.push(result);
              instance.note = {};
              resetForm(form);
            }, () => {
              instance.notes_is_submitting = false;
              instance.$rootScope.show_spinner = false;
            },
          );
      }
    };

    instance.submitPreferenceForm = (form) => {
      if (!form.$valid) {
        return false;
      }

      const data = {
        name: instance.preference.name,
        value: instance.preference.value,
      };

      instance.preferences_is_submitting = true;
      instance.$rootScope.show_spinner = true;
      if (instance.preference.id) {
        CustomerPreference.update(
          instance.current_company_id,
          instance.customer.id,
          instance.preference.id,
          data,
        ).then(
          () => {
            instance.preferences_is_submitting = false;
            instance.$rootScope.show_spinner = false;
            instance.$rootScope.customer_preferences = instance.preferences;
            instance.preference = {};
          }, () => {
            instance.preferences_is_submitting = false;
            instance.$rootScope.show_spinner = false;
          },
        );
      } else {
        CustomerPreference.create(instance.current_company_id, instance.customer.id, data)
          .then(
            (result) => {
              instance.preferences_is_submitting = false;
              instance.$rootScope.show_spinner = false;
              instance.$rootScope.customer_preferences.push(result);
              instance.preference = {};

              resetForm(form);
            }, () => {
              instance.preferences_is_submitting = false;
              instance.$rootScope.show_spinner = false;
            },
          );
      }
    };

    instance.submitAllergiesForm = (form) => {
      if (!form.$valid) {
        return false;
      }

      const data = {
        allergy: instance.allergy.allergy,
      };

      instance.allergies_is_submitting = true;
      instance.$rootScope.show_spinner = true;
      if (instance.allergy.id) {
        CustomerAllergies.update(
          instance.current_company_id,
          instance.customer.id,
          instance.allergy.id,
          data,
        ).then(
          () => {
            instance.$rootScope.customer_allergies = instance.allergies;
            instance.allergy = {};
            instance.allergies_is_submitting = false;
            instance.$rootScope.show_spinner = false;
          }, () => {
            instance.allergies_is_submitting = false;
            instance.$rootScope.show_spinner = false;
          },
        );
      } else {
        CustomerAllergies.create(instance.current_company_id, instance.customer.id, data)
          .then(
            (result) => {
              instance.allergies_is_submitting = false;
              instance.$rootScope.show_spinner = false;
              instance.$rootScope.customer_allergies.push(result);
              instance.allergy = {};

              instance.$rootScope.$broadcast('edit_customer.allergy_is_added', {
                customerId: instance.customer.id,
                currentNumber: instance.customerAllergies.length
              });

              resetForm(form);
            }, () => {
              instance.allergies_is_submitting = false;
              instance.$rootScope.show_spinner = false;
            },
          );
      }
    };
  };
}
