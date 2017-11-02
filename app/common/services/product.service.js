export default class Product {
  constructor($http, $q) {
    'ngInject';

    this.$http = $http;
    this.$q = $q;
  }

  create(companyId, data) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/products/create`,
      method: 'POST',
      data,
    }).then(result => result.data);
  }

  delete(companyId, productId) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http.delete(`${API_URL}/company/${companyId}/products/${productId}`)
      .then(result => result.data);
  }

  hidden(companyId, productId) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http.post(`${API_URL}/company/${companyId}/products/hidden/${productId}`)
      .then(result => result.data);
  }

  getAll(companyId, hidden) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/product${(hidden ? '?hidden=true' : '')}`,
      method: 'GET',
    }).then(
      (result) => {
        // TODO remove it and make separate method to get hidden products and not
        if (hidden) {
          return result.data;
        }

        return result.data.filter(item => item.shaded === false);
      });
  }

  getAvailableTables(companyId, productId, date) {
    if (!(companyId && productId && date)) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/product/available_tables`,
      method: 'POST',
      data: { product_id: productId, date },
    }).then(result => result.data);
  }

  getAvailableTablesOfProducts(companyId, date) {
    if (!(companyId && date)) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/product/available_tables_of_products`,
      method: 'POST',
      data: { date },
    }).then(result => result.data);
  }
}
