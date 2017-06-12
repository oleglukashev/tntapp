export default class CustomerCompany {
  constructor($http, $q) {
    'ngInject';

    this.$http           = $http;
    this.$q              = $q;
  }

  getSocialUrls(company_id) {
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: API_URL + '/company/' + company_id + '/customer_reservation',
      method: 'GET',
    }).then((result) => result.data);
  }
}