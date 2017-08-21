import angular from 'angular';

export default class UserMenuEditCtrl {
  constructor(User, Customer, CustomerNote, CustomerPreference, CustomerAllergies, $rootScope, $modalInstance, moment, $modal) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Customer             = Customer;
    this.CustomerNote         = CustomerNote;
    this.CustomerPreference   = CustomerPreference;
    this.CustomerAllergies    = CustomerAllergies;

    this.$rootScope           = $rootScope;
    this.$modalInstance       = $modalInstance;
    this.$modal               = $modal;
    this.moment               = moment;
    this.submited_success     = false;

    this.note = {};

    $rootScope.userData = $rootScope.customer_reservations[0].customer;

    this.date_options = {
      formatYear: 'yyyy',
      startingDay: 1,
      showWeeks: false,
      class: 'datepicker'
    };

    this.loadNotes();
    this.loadPreferences();
    this.loadAllergies();
  }

  loadNotes() {
    this.CustomerNote.getAll(this.current_company_id, this.$rootScope.userData.id)
      .then((notes) => {
        this.notes = notes;
      },
      (error) => {
      });
  }

  loadPreferences() {
    this.CustomerPreference.getAll(this.current_company_id, this.$rootScope.userData.id)
      .then((preferences) => {
        this.preferences = preferences;
      },
      (error) => {
      });
  }

  loadAllergies() {
    this.CustomerAllergies.getAll(this.current_company_id, this.$rootScope.userData.id)
      .then((allergies) => {
        this.allergies = allergies;
      },
      (error) => {
      });
  }

  deleteNote(index) {
    this.CustomerNote.delete(this.current_company_id, this.$rootScope.userData.id, this.notes[index].id)
      .then((result) => {
        this.notes.splice(index, 1);
      },
      (error) => {
      });
  }

  deletePreference(index) {
    this.CustomerPreference.delete(this.current_company_id, this.$rootScope.userData.id, this.preferences[index].id)
      .then((result) => {
        this.preferences.splice(index, 1);
      },
      (error) => {
      });
  }

  deleteAllergy(index) {
    this.CustomerAllergies.delete(this.current_company_id, this.$rootScope.userData.id, this.allergies[index].id)
      .then((result) => {
        this.allergies.splice(index, 1);
      },
      (error) => {
      });
  }

  submitForm(is_valid) {
    if (!is_valid) {
      return false;
    }

    let userData = this.$rootScope.userData;
    this.is_submitting = true;

    if (userData.date_of_birth)
      userData.date_of_birth = this.moment(userData.date_of_birth).format('DD-MM-YYYY');

    let data = {
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
      averageRating: userData.average_rating
    };

    this.Customer.edit(this.current_company_id, userData.id, data)
      .then((result) => {
        userData = Object.assign(data, userData);
        this.closeModal();
      },
      (error) => {
      });
  }

  submitNoteForm(is_valid) {
    if (!is_valid) {
      return false;
    }

    this.notes_is_submitting = true;

    let data = {
      note: this.note.note
    };

    if (this.note.id) {
      this.CustomerNote.update(this.current_company_id, this.$rootScope.userData.id, this.note.id, data)
        .then((result) => {
          this.$rootScope.customer_notes = this.notes;
          this.closeModal();
        },
        (error) => {
        });
    } else {
      this.CustomerNote.create(this.current_company_id, this.$rootScope.userData.id, data)
        .then((result) => {
          this.$rootScope.customer_notes.push(result);
          this.closeModal();
        },
        (error) => {
        });
    }
  }

  submitPreferenceForm(is_valid) {
    if (!is_valid) {
      return false;
    }

    this.preferences_is_submitting = true;

    let data = {
      name : this.preference.name,
      value: this.preference.value,
    };

    if (this.preference.id) {
      this.CustomerPreference.update(this.current_company_id, this.$rootScope.userData.id, this.preference.id, data)
        .then((result) => {
          this.$rootScope.customer_preferences = this.preferences;
          this.closeModal();
        },
        (error) => {
        });
    } else {
      this.CustomerPreference.create(this.current_company_id, this.$rootScope.userData.id, data)
        .then((result) => {
          this.$rootScope.customer_preferences.push(result);
          this.closeModal();
        },
        (error) => {
        });
    }
  }

  submitAllergiesForm(is_valid) {
    if (!is_valid) {
      return false;
    }

    this.allergies_is_submitting = true;

    let data = {
      allergy: this.allergy.allergy
    };

    if (this.allergy.id) {
      this.CustomerAllergies.update(this.current_company_id, this.$rootScope.userData.id, this.allergy.id, data)
        .then((result) => {
          this.$rootScope.customer_allergies = this.allergies;
          this.closeModal();
        },
        (error) => {
        });
    } else {
      this.CustomerAllergies.create(this.current_company_id, this.$rootScope.userData.id, data)
        .then((result) => {
          this.$rootScope.customer_allergies.push(result);
          this.closeModal();
        },
        (error) => {
        });
    }
  }

  closeModal() {
    this.$modalInstance.dismiss('cancel');
  }

  openNotesModal(user_id) {
    let modalInstance = this.$modal.open({
      templateUrl: 'user_menu.notes.view.html',
      controller: 'UserMenuNotesCtrl as user_notes',
      size: 'md'
    });

    modalInstance.result.then((selectedItem) => {
      //success
    }, () => {
      // fail
    });
  }
}
