export default class Table {
  constructor($http, $q) {
    'ngInject';

    this.$http = $http;
    this.$q = $q;
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
      url: `${API_URL}/company/${companyId}/table/occupied?datetime=${data.datetime}&part_id=${data.part_id}`,
      method: 'GET',
    }).then(result => result.data);
  }

  save(companyId, data) {
    if (!company_id) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/table/save`,
      method: 'POST',
      data: data,
    }).then(result => result.data);
  }
}
