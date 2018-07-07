export default function UserMenuEditFactory(UserMenu, Customer, CustomerService, CustomerNote, CustomerPreference,
  CustomerAllergies, moment, $rootScope) {
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
          instance.$rootScope.$broadcast('NewReservationCtrl.reload_reservations');
          instance.customerNotes.splice(index, 1);
          UserMenu.notes = instance.customerNotes;
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
          instance.$rootScope.$broadcast('NewReservationCtrl.reload_reservations');
          instance.customerPreferences.splice(index, 1);
          UserMenu.preferences = instance.customerPreferences;
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
          instance.$rootScope.$broadcast('NewReservationCtrl.reload_reservations');
          instance.customerAllergies.splice(index, 1);
          UserMenu.allergies = instance.customerAllergies;
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
        country: customerClone.country,
        house_number: customerClone.house_number,
        zipcode: customerClone.zipcode,
        city: customerClone.city,
        mail: customerClone.mail,
        date_of_birth: customerClone.date_of_birth,
        gender: customerClone.gender,
      };

      if (data.first_name === '') data.first_name = null;
      if (data.last_name === '') data.last_name = null;

      Customer.edit(instance.current_company_id, customerClone.id, data).then(
        (customer) => {
          UserMenu.customer = customer;

          if (instance.$state.current.name === 'app.customers') {
            CustomerService.initCustomers(instance.current_company_id);
          }

          instance.$rootScope.$broadcast('NewReservationCtrl.reload_reservations');
          instance.is_submitting = false;
          instance.$rootScope.show_spinner = false;
          instance.$modalInstance.close();
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
          (result) => {
            instance.note = null;
            UserMenu.notes = instance.customerNotes;
            instance.$rootScope.$broadcast('NewReservationCtrl.reload_reservations');
            instance.notes_is_submitting = false;
            instance.$rootScope.show_spinner = false;
            resetForm(form);
            instance.$modalInstance.close();
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
              instance.note = null;
              instance.customerNotes.push(result);
              UserMenu.notes = instance.customerNotes;
              instance.$rootScope.$broadcast('NewReservationCtrl.reload_reservations');
              resetForm(form);
              instance.$modalInstance.close();
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
        owner: instance.preference.owner,
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
          (result) => {
            instance.preference = null;
            UserMenu.preferences = instance.customerPreferences;
            instance.$rootScope.$broadcast('NewReservationCtrl.reload_reservations');
            instance.preferences_is_submitting = false;
            instance.$rootScope.show_spinner = false;
            resetForm(form);
            instance.$modalInstance.close();
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
              instance.preference = null;
              instance.customerPreferences.push(result);
              UserMenu.preferences = instance.customerPreferences;
              instance.$rootScope.$broadcast('NewReservationCtrl.reload_reservations');
              resetForm(form);
              instance.$modalInstance.close();
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
        owner: instance.allergy.owner,
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
          (result) => {
            instance.allergy = null;
            UserMenu.allergies = instance.customerAllergies;
            instance.$rootScope.$broadcast('NewReservationCtrl.reload_reservations');
            instance.allergies_is_submitting = false;
            instance.$rootScope.show_spinner = false;
            resetForm(form);
            instance.$modalInstance.close();
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
              instance.allergy = null;
              instance.customerAllergies.push(result);
              UserMenu.allergies = instance.customerAllergies;
              instance.$rootScope.$broadcast('NewReservationCtrl.reload_reservations');
              resetForm(form);
              instance.$modalInstance.close();
            }, () => {
              instance.allergies_is_submitting = false;
              instance.$rootScope.show_spinner = false;
            },
          );
      }
    };
  };
}
