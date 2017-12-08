export default function NewReservationTypeFactory($auth) {
  'ngInject';

  return (that) => {
    const instance = that;

    instance.authenticate = (provider) => {
      instance.reservation.social = provider;

      if (provider === 'email') {
        instance.selectTab(instance.pagination.type);
      } else {
        $auth.authenticate(provider).then((response) => {
          instance.$window.localStorage.setItem('social_account', JSON.stringify(response.data));
          instance.reservation.first_name = response.data.name.split(' ')[0];
          instance.reservation.last_name = response.data.name.split(' ')[1] || this.reservation.first_name;
          instance.reservation.mail = response.data.email;
          instance.reservation.date_of_birth = response.data.date_of_birth;
          instance.reservation.primary_phone_number = response.data.primary_phone_number;

          if (response.data.gender) {
            instance.reservation.gender =
              instance.parseGenderFromSocialResponse(response.data.gender);
          }

          instance.selectTab(instance.pagination.type);
        }, () => {});
      }
    };

    instance.parseGenderFromSocialResponse = (genderStr) => {
      if (genderStr === 'Man' || genderStr === 'male') {
        return 'Man';
      }

      if (genderStr === 'Vrouw' || genderStr === 'female') {
        return 'Vrouw';
      }

      return null;
    };
  };
}
