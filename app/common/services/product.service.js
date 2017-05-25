import angular from 'angular';

export default class Product {
  constructor(User, $http, $q) {
    'ngInject';

    this.$http           = $http;
    this.$q              = $q;
  }

  create(company_id, data) {
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: API_URL + '/company/' + company_id + '/products/create',
      method: 'POST',
      data: data
    }).then((result) => result.data);
  }

  hidden(company_id, product_id) {
    if (! company_id) {
      return this.$q.defer().promise;
    }

    return this.$http.post(API_URL + '/company/' + company_id + '/products/hidden/' + product_id)
      .then((result) => result.data);
  }

  getAll(company_id, with_hidden) {
    let deferred = this.$q.defer();

    if (! company_id) {
      return deferred.promise;
    }

    return this.$http({
        url: API_URL + '/company/' + company_id + '/product',
        method: 'GET',
      }).then(
        (result) => {
          if (with_hidden) {
            return result.data;
          } else {
            return result.data.filter((item) => item.hidden == false);
          }
        });
  }

  getAvailableTables(company_id, product_id, date) {
    let deferred = this.$q.defer();

    if (!(company_id && product_id && date)) {
      return deferred.promise;
    }

    return this.$http({
      url: API_URL + '/company/' + company_id + '/product/available_tables',
      method: 'POST',
      data: { product_id: product_id, date: date }
    }).then((result) => result.data);
  }

}
