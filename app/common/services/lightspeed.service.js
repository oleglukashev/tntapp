export default class Lightspeed {
  constructor($q, $http) {
    'ngInject';

    this.$q = $q;
    this.$http = $http;
  }

  getAllTables(companyId, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/lightspeed/tables`,
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then(result => result.data);
  }
}
