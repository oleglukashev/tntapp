import angular from 'angular';

export default class UserMenuEditCtrl {
  constructor(User, Customer, $rootScope, $modalInstance, moment) {
    'ngInject';

    this.current_company = User.current_company;
    this.Customer        = Customer;

    this.$rootScope           = $rootScope;
    this.$modalInstance       = $modalInstance;
    this.moment               = moment;
    this.submited_success     = false;

    this.date_options = {
      formatYear: 'yyyy',
      startingDay: 1,
      showWeeks: false,
      class: 'datepicker'
    };
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
    };

    this.Customer.edit(this.current_company.id, userData.id, data)
      .then((result) => {
        userData = Object.assign(data, userData);
        this.closeModal();
      },
      (error) => {
      });
  }

  closeModal() {
    this.$modalInstance.dismiss('cancel');
  }

}
