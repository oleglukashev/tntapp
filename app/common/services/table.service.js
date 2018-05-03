import { buildURL } from '../../common/utils';

export default class Table {
  constructor($http, $q, filterFilter) {
    'ngInject';

    this.$http = $http;
    this.$q = $q;
    this.filterFilter = filterFilter;
  }

  getAll(companyId, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/tables`,
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then(result => result.data);
  }

  create(companyId, data, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/tables`,
      skipAuthorization: skipJwtAuth,
      method: 'POST',
      data,
    }).then(result => result.data);
  }

  update(companyId, data, id, skipJwtAuth) {
    if (!companyId || !id) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/tables/${id}`,
      skipAuthorization: skipJwtAuth,
      method: 'PATCH',
      data,
    }).then(result => result.data);
  }

  updatePositions(companyId, data, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/tables/update_positions`,
      skipAuthorization: skipJwtAuth,
      method: 'POST',
      data,
    }).then(result => result.data);
  }

  delete(companyId, id, skipJwtAuth) {
    if (!companyId || !id) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/tables/${id}`,
      skipAuthorization: skipJwtAuth,
      method: 'DELETE',
    }).then(result => result.data);
  }

  getOccupiedTables(companyId, data, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: buildURL(`${API_URL}/company/${companyId}/tables/occupied`, data),
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then(result => result.data);
  }

  getTableNumbersByTableIds(tables, tableIds) {
    if (!tables) return [];
    const result = [];

    tableIds.forEach((value) => {
      const table = this.filterFilter(tables, { id: value })[0];

      if (table) {
        result.push(table.table_number);
      }
    }, result);

    return result;
  }
}
