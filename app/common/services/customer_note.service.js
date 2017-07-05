export default class CustomerNote {
  constructor($http, $q) {
    'ngInject';

    this.$http = $http;
    this.$q    = $q;
  }

  create(company_id, customer_id, data) {
    if (!company_id || !customer_id) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: API_URL + '/company/' + company_id + '/customer/' + customer_id + '/note',
      method: 'POST',
      data: data
    }).then((result) => result.data);
  }

  update(company_id, customer_id, note_id, data) {
    let deferred = this.$q.defer();

    if (! company_id || !customer_id || !note_id) {
      return deferred.promise;
    }

    return this.$http.patch(API_URL + '/company/' + company_id + '/customer/' + customer_id + '/note/' + note_id,
      data
    ).then((result) => result.data);
  }

  delete(company_id, customer_id, note_id) {
    if (! company_id || !customer_id || !note_id) {
      return deferred.promise;
    }

    return this.$http.delete(API_URL + '/company/' + company_id + '/customer/' + customer_id + '/note/' + note_id)
      .then((result) => result.data);
  }

  getAll(company_id, customer_id) {
    let deferred = this.$q.defer();

    if (! company_id || !customer_id) {
      return deferred.promise;
    }

    return this.$http({
        url: API_URL + '/company/' + company_id + '/customer/' + customer_id + '/note',
        method: 'GET',
      }).then(
        (result) => {
          return result.data;
        });
  }
}