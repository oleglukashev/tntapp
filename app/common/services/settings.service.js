export default class Settings {
  constructor($http, $q, $cookieStore) {
    'ngInject';

    this.$http = $http;
    this.$q = $q;
    this.$cookieStore = $cookieStore;
  }

  getGeneralSettings(companyId, skipJwtAuth) {
    // need to think how can we optimize this block for each method
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/general`,
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then(result => result.data);
  }

  getMailsSettings(companyId, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/mails`,
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then(result => result.data);
  }

  getMailsTextsSettings(companyId, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/mails_texts`,
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then(result => result.data);
  }

  getWarningsSettings(companyId, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/warnings`,
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then(result => result.data);
  }

  getLimitsSettings(companyId, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/minimum_seats_free`,
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then(result => result.data);
  }

  getProductsLimitsSettings(companyId, productId, skipJwtAuth) {
    if (!companyId || !productId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/products/${productId}/limits`,
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then(result => result.data);
  }

  getPluginsSettings(companyId, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/plugins`,
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then(result => result.data);
  }

  getThemeSettings(companyId, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/theme`,
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then(result => result.data);
  }

  updateGeneralSettings(companyId, data, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/general`,
      skipAuthorization: skipJwtAuth,
      method: 'PATCH',
      data,
    }).then(result => result.data);
  }

  updateMailsSettings(companyId, data, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/mails`,
      skipAuthorization: skipJwtAuth,
      method: 'PATCH',
      data,
    }).then(result => result.data);
  }

  updateMailtext(companyId, id, data, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/mails_texts/${id}`,
      skipAuthorization: skipJwtAuth,
      method: 'PATCH',
      data,
    }).then(result => result.data);
  }

  updateWarning(companyId, id, data, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/warnings/${id}`,
      skipAuthorization: skipJwtAuth,
      method: 'PATCH',
      data,
    }).then(result => result.data);
  }

  saveLimitsSettings(companyId, data, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/minimum_seats_free/save`,
      skipAuthorization: skipJwtAuth,
      method: 'POST',
      data,
    }).then(result => result.data);
  }

  saveProductsLimitsSettings(companyId, productId, data, skipJwtAuth) {
    if (!companyId || !productId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/products/${productId}/limits/save`,
      skipAuthorization: skipJwtAuth,
      method: 'POST',
      data,
    }).then(result => result.data);
  }

  updateTnrSyncTokenSettings(companyId, data, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/plugins/update_tnr_sync_token`,
      skipAuthorization: skipJwtAuth,
      method: 'PATCH',
      data,
    }).then(result => result.data);
  }

  updateThemeSettings(companyId, data, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/settings/theme`,
      skipAuthorization: skipJwtAuth,
      method: 'PATCH',
      data,
    }).then(result => result.data);
  }

  saveThemeToCookie(value) {
    this.$cookieStore.put('theme', value);
  }
}
