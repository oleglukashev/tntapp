export default class EmailsDelivery {
  constructor($http, $q) {
    'ngInject';

    this.$http = $http;
    this.$q = $q;
  }

  editorUrl(companyId, id) {
    return `${API_URL.replace('/api/v2', '')}/grapes/c/${companyId}${id ? '/' + id : ''}`;
  }

  getAll(companyId, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/emails_deliveries`,
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then(result => result.data);
  }

  create(companyId, data, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/emails_deliveries`,
      method: 'POST',
      skipAuthorization: skipJwtAuth,
      data,
    }).then(result => result.data);
  }

  update(companyId, data, id, skipJwtAuth) {
    if (!companyId || !id) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/emails_deliveries/${id}`,
      skipAuthorization: skipJwtAuth,
      method: 'PATCH',
      data,
    }).then(result => result.data);
  }

  run(companyId, id, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/emails_deliveries/${id}/run`,
      method: 'POST',
      skipAuthorization: skipJwtAuth
    }).then(result => result.data);
  }

  remove(companyId, id, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/emails_deliveries/${id}`,
      method: 'DELETE',
      skipAuthorization: skipJwtAuth
    }).then(result => result.data);
  }
}
