export default class Controller {
  constructor($auth, $window, $rootScope) {
    'ngInject';

    this.$auth = $auth;
    this.$window = $window;

    this.$onChanges = () => {
      this.current_tab_index = this.currentTabIndex;
    };

    $rootScope.$on('event:social-sign-in-success', (event, data) => {
      this.postAuthProcess(data);
    });
  }

  authenticate(provider) {
    this.reservation.social = provider;

    if (provider === 'email') {
      this.selectTab({ index: this.pagination.type });
    } else {
      this.$auth.authenticate(provider).then((response) => {
        this.postAuthProcess(response.data);
      }, () => {});
    }
  }

  postAuthProcess(data) {
    this.$window.localStorage.setItem('social_account', JSON.stringify(data));
    this.reservation.first_name = data.first_name || '';
    this.reservation.last_name = data.last_name || '';
    this.reservation.mail = data.email;
    this.reservation.date_of_birth = data.date_of_birth;
    this.reservation.primary_phone_number = data.primary_phone_number;

    if (data.gender) {
      this.reservation.gender = this.parseGenderFromSocialResponse(data.gender);
    }

    this.selectTab({ index: this.pagination.type });
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