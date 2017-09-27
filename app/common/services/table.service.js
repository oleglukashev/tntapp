import angular from 'angular';

export default class Table {
  constructor($http, $q, filterFilter) {
    'ngInject';

    this.$http = $http;
    this.$q = $q;
    this.filterFilter = filterFilter;
  }

  getAll(companyId) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/table`,
      method: 'GET',
    }).then(result => result.data);
  }

  getOccupiedTables(companyId, data) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/table/occupied?datetime=${data.date_time}&part_id=${data.part_id}`,
      method: 'GET',
    }).then(result => result.data);
  }

  save(companyId, data) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/table/save`,
      method: 'POST',
      data: data,
    }).then(result => result.data);
  }

  getTableNumbersByTableIds(tables, tableIds) {
    const result = [];

    angular.forEach(tableIds, (value) => {
      const table = this.filterFilter(tables, { id: value })[0];

      if (table) {
        result.push(table.table_number);
      }
    }, result);

    return result;
  }
}
