export default function NewReservationZoneFactory($auth, filterFilter, moment) {
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
          instance.reservation.last_name = response.data.name.split(' ')[1] || instance.reservation.first_name;
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

    instance.tablesDataIsLoaded = () =>
      instance.tables_is_loaded && instance.current_part.occupied_tables_is_loaded;

    instance.setZone = (zone) => {
      instance.current_part.zones_is_showed = false;
      instance.current_part.zone = zone;
    };

    instance.changeTableValuesPostProcess = () => {
      instance.current_part.tables = [];

      Object.keys(instance.current_part.tables_values).forEach((key) => {
        if (instance.current_part.tables_values[key]) {
          instance.current_part.tables.push(key);
        }
      });
    };

    instance.isDisabledTableByTableId = (tableId) => {
      const table = filterFilter(instance.tables, { id: tableId })[0];
      let result = table ? table.hidden === true : false;

      if (!result && instance.occupied_tables) {
        result = typeof instance.occupied_tables[tableId] !== 'undefined';
      }

      if (!result) {
        result = false;
      }

      return result;
    };

    instance.zoneIsClosed = (zoneId) => {
      const currentDate = instance.current_part.date;

      if (currentDate && zoneId) {
        const date = moment(currentDate).format('YYYY-MM-DD');

        if (instance.zone_time_ranges[date] && instance.zone_time_ranges[date][zoneId]) {
          const timeRange = instance.zone_time_ranges[date][zoneId];

          if (timeRange.whole_day) {
            return !timeRange.value;
          } else if (instance.current_part.time && !timeRange.value) {
            return instance.current_part.time >= timeRange.start_time &&
              instance.current_part.time <= timeRange.end_time;
          }
        }
      }

      return false;
    };
  };
}
