import angular from 'angular';

export default class ReservationPart {
  constructor(User, $http, $q) {
    'ngInject';

    this.$http           = $http;
    this.$q              = $q;
  }

  edit(company_id, reservation_part_id, data) {
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http.patch(
        API_URL + '/company/' + company_id + '/reservation_part/' + reservation_part_id, data
      ).then((result) => result.data);
  }
}
