import { buildURL } from '../../common/utils';

export default class Untill {
  constructor($q, $http) {
    'ngInject';

    this.$q = $q;
    this.$http = $http;
  }

  updateSettings(companyId, data) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/untill/update_connection`,
      method: 'PATCH',
      data,
    }).then(result => result.data);
  }

  deleteConnection(companyId) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/untill/delete_connection`,
      method: 'POST',
    }).then(result => result.data);
  }

  getSettings(companyId, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/untill/login_data`,
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then(result => result.data);
  }

  search(companyId, id, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: buildURL(`${API_URL}/company/${companyId}/settings/untill/search`, { id }),
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then(result => result.data);
  }
}
