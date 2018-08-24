export default class Controller {
  constructor($auth, $window) {
    'ngInject';

    this.$auth = $auth;
    this.$window = $window;

    this.$onChanges = () => {
      this.current_tab_index = this.currentTabIndex;
    };
  }

  authenticate(provider) {
    this.reservation.social = provider;

    if (provider === 'email') {
      this.selectTab({ index: this.pagination.type });
    } else {
      this.$auth.authenticate(provider).then((response) => {
        this.$window.localStorage.setItem('social_account', JSON.stringify(response.data));
        this.reservation.first_name = response.data.name.split(' ')[0];
        this.reservation.last_name = response.data.name.split(' ')[1] || this.reservation.first_name;
        this.reservation.mail = response.data.email;
        this.reservation.date_of_birth = response.data.date_of_birth;
        this.reservation.primary_phone_number = response.data.primary_phone_number;

        if (response.data.gender) {
          this.reservation.gender =
            this.parseGenderFromSocialResponse(response.data.gender);
        }

        this.selectTab({ index: this.pagination.type });
      }, () => {});
    }
  }

  static parseGenderFromSocialResponse(genderStr) {
    if (genderStr === 'Man' || genderStr === 'male') {
      return 'Man';
    }

    if (genderStr === 'Vrouw' || genderStr === 'female') {
      return 'Vrouw';
    }

    return null;
  }
}