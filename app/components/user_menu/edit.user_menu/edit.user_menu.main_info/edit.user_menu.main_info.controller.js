export default class EditUserMenuMainInfoCtrl {
  constructor(User, AppConstants, UserMenu, Customer, CustomerService, moment, $state, $rootScope) {
    'ngInject';

    this.currentCompanyId = User.getCompanyId();
    this.AppConstants = AppConstants;
    this.UserMenu = UserMenu;
    this.Customer = Customer;
    this.CustomerService = CustomerService;
    this.moment = moment;
    this.$state = $state;
    this.$rootScope = $rootScope;

    this.$onInit = () => {
    }
  }

  submitForm(isValid, form) {
    if (!isValid) {
      return false;
    }

    const customerClone = this.customer;
    this.is_submitting = true;
    this.$rootScope.show_spinner = true;

    if (customerClone.date_of_birth) {
      customerClone.date_of_birth = this.moment(customerClone.date_of_birth, 'DD-MM-YYYY').format('DD-MM-YYYY');
    } else {
      customerClone.date_of_birth = null;
    }

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

    this.Customer.edit(this.currentCompanyId, customerClone.id, data).then((customer) => {
      this.UserMenu.customer = customer;

      if (this.$state.current.name === 'app.customers') {
        this.CustomerService.initCustomers();
      }

      this.$rootScope.$broadcast('NewReservationCtrl.reload_reservations');
      this.is_submitting = false;
      this.$rootScope.show_spinner = false;
      this.dismiss({$value: 'cancel'});
    }, () => {
      this.is_submitting = false;
      this.$rootScope.show_spinner = false;
    });
  }
}
