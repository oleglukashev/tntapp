import angular from 'angular';

export default class ReservationStatus {
  constructor(Upload, User, $http, $q) {
    'ngInject';

    this.$http           = $http;
    this.$q              = $q;
    this.Upload          = Upload;
  }

  edit(company_id, reservation_id, data) {
    let deferred = this.$q.defer();

    if (! company_id) {
      return deferred.promise;
    }

    return this.$http.post(API_URL + '/company/' + company_id + '/reservation/edit/' + reservation_id + '/status',
      data
    ).then((result) => result.data);
  }

  setPresent(company_id, reservation_id, present=true) {
    let deferred = this.$q.defer();
    let present_url = (present ? 'set_present' : 'unset_present');

    if (! company_id) {
      return deferred.promise;
    }

    return this.$http.get(
      API_URL + '/company/' + company_id + '/reservation/' + present_url + '/' + reservation_id
    ).then((result) => result.data);
  }
}
