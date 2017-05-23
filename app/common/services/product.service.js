import angular from 'angular';

export default class Product {
  constructor(User, $http, $q) {
    'ngInject';

    this.$http           = $http;
    this.$q              = $q;
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
