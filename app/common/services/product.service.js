import angular from 'angular';

export default class Product {
  constructor(User, AppConstants, $http, $q) {
    'ngInject';

    this.$http          = $http;
    this.$q             = $q;
    this.AppConstants   = AppConstants;
    this.currentUser    = User.current;
    this.currentCompany = User.currentCompany;
  }

  getAll(with_hidden) {
    let deferred = this.$q.defer();

    if (!this.currentCompany) {
      return deferred.promise;
    }

    return this.$http({
        url: this.AppConstants.api + '/company/' + this.currentCompany.id + '/product',
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

  getAvailableTables(product_id, date) {
    let deferred = this.$q.defer();

    if (!(this.currentCompany && product_id && date)) {
      return deferred.promise;
    }

    return this.$http({
      url: this.AppConstants.api + '/company/' + this.currentCompany.id + '/product/available_tables',
      method: 'POST',
      data: { product_id: product_id, date: date }
    }).then((result) => result.data);
  }

}
