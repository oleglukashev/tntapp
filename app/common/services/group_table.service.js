export default class GroupTable {
  constructor($http, $q) {
    'ngInject';

    this.$http = $http;
    this.$q = $q;
  }

  getAll(companyId, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/group_tables`,
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then(result => result.data);
  }

  create(companyId, data, skipJwtAuth) {
    if (!companyId || !data) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/group_tables`,
      skipAuthorization: skipJwtAuth,
      method: 'POST',
      data,
    }).then(result => result.data);
  }

  update(companyId, groupTableId, data, skipJwtAuth) {
    if (!companyId || !groupTableId || !data) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/group_tables/${groupTableId}`,
      skipAuthorization: skipJwtAuth,
      method: 'PATCH',
      data,
    }).then(result => result.data);
  }

  delete(companyId, groupTableId, skipJwtAuth) {
    if (!companyId || !groupTableId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/group_tables/${groupTableId}`,
      skipAuthorization: skipJwtAuth,
      method: 'DELETE',
    }).then(result => result.data);
  }
}
