export default class UserMenuEditCtrl {
  constructor(
    User, Customer, CustomerNote, CustomerPreference, CustomerAllergies, $rootScope, $modalInstance,
    moment, $modal,
  ) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Customer = Customer;
    this.CustomerNote = CustomerNote;
    this.CustomerPreference = CustomerPreference;
    this.CustomerAllergies = CustomerAllergies;

    this.$rootScope = $rootScope;
    this.$modalInstance = $modalInstance;
    this.$modal = $modal;
    this.moment = moment;
    this.submited_success = false;

    this.note = {};

    this.$rootScope.userData = this.$rootScope.customer;

    this.date_options = {
      formatYear: 'yyyy',
      startingDay: 1,
      showWeeks: false,
      class: 'datepicker',
    };

    this.loadNotes();
    this.loadPreferences();
    this.loadAllergies();
  }

  loadNotes() {
    this.CustomerNote.getAll(this.current_company_id, this.$rootScope.userData.id)
      .then(
        (notes) => {
          this.notes = notes;
        },
        () => {},
      );
  }

  loadPreferences() {
    this.CustomerPreference.getAll(this.current_company_id, this.$rootScope.userData.id)
      .then(
        (preferences) => {
          this.preferences = preferences;
        },
        () => {},
      );
  }

  loadAllergies() {
    this.CustomerAllergies.getAll(this.current_company_id, this.$rootScope.userData.id)
      .then(
        (allergies) => {
          this.allergies = allergies;
        },
        () => {},
      );
  }

  deleteNote(index) {
    this.CustomerNote.delete(
      this.current_company_id,
      this.$rootScope.userData.id,
      this.notes[index].id,
    )
      .then(
        () => {
          this.notes.splice(index, 1);
        },
        () => {},
      );
  }

  deletePreference(index) {
    this.CustomerPreference.delete(
      this.current_company_id,
      this.$rootScope.userData.id,
      this.preferences[index].id,
    )
      .then(
        () => {
          this.preferences.splice(index, 1);
        },
        () => {},
      );
  }

  deleteAllergy(index) {
    this.CustomerAllergies.delete(
      this.current_company_id,
      this.$rootScope.userData.id,
      this.allergies[index].id,
    )
      .then(
        () => {
          this.allergies.splice(index, 1);
        },
        () => {},
      );
  }

  submitForm(isValid) {
    if (!isValid) {
      return false;
    }

    let userData = this.$rootScope.userData;
    this.is_submitting = true;

    if (userData.date_of_birth) {
      userData.date_of_birth = this.moment(userData.date_of_birth).format('DD-MM-YYYY');
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

    this.Customer.edit(this.current_company_id, userData.id, data)
      .then(
        () => {
          userData = Object.assign(data, userData);
          this.$rootScope.$broadcast('ProfilesCtrl.reload_customers');
          this.closeModal();
        },
        () => {},
      );
  }

  submitNoteForm(isValid) {
    if (!isValid) {
      return false;
    }

    this.notes_is_submitting = true;

    const data = {
      note: this.note.note,
    };

    if (this.note.id) {
      this.CustomerNote.update(
        this.current_company_id,
        this.$rootScope.userData.id,
        this.note.id,
        data,
      )
        .then(
          () => {
            this.$rootScope.customer_notes = this.notes;
            this.closeModal();
          },
          () => {},
        );
    } else {
      this.CustomerNote.create(this.current_company_id, this.$rootScope.userData.id, data)
        .then(
          (result) => {
            this.$rootScope.customer_notes.push(result);
            this.closeModal();
          },
          () => {},
        );
    }
  }

  submitPreferenceForm(isValid) {
    if (!isValid) {
      return false;
    }

    this.preferences_is_submitting = true;

    const data = {
      name: this.preference.name,
      value: this.preference.value,
    };

    if (this.preference.id) {
      this.CustomerPreference.update(
        this.current_company_id,
        this.$rootScope.userData.id,
        this.preference.id,
        data,
      )
        .then(
          () => {
            this.$rootScope.customer_preferences = this.preferences;
            this.closeModal();
          },
          () => {},
        );
    } else {
      this.CustomerPreference.create(this.current_company_id, this.$rootScope.userData.id, data)
        .then(
          (result) => {
            this.$rootScope.customer_preferences.push(result);
            this.closeModal();
          },
          () => {},
        );
    }
  }

  submitAllergiesForm(isValid) {
    if (!isValid) {
      return false;
    }

    this.allergies_is_submitting = true;

    const data = {
      allergy: this.allergy.allergy,
    };

    if (this.allergy.id) {
      this.CustomerAllergies.update(
        this.current_company_id,
        this.$rootScope.userData.id,
        this.allergy.id,
        data,
      )
        .then(
          () => {
            this.$rootScope.customer_allergies = this.allergies;
            this.closeModal();
          },
          () => {},
        );
    } else {
      this.CustomerAllergies.create(this.current_company_id, this.$rootScope.userData.id, data)
        .then(
          (result) => {
            this.$rootScope.customer_allergies.push(result);
            this.closeModal();
          },
          () => {},
        );
    }
  }

  closeModal() {
    this.$modalInstance.dismiss('cancel');
  }

  openNotesModal() {
    const modalInstance = this.$modal.open({
      templateUrl: 'user_menu.notes.view.html',
      controller: 'UserMenuNotesCtrl as user_notes',
      size: 'md',
    });

    modalInstance.result.then(() => {}, () => {});
  }
}
