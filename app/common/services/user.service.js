import { buildURL } from '../utils/index';

export default class User {
  constructor(JWT, Upload, Settings, Theme, $http, $state, $q, $location, $window,
    $rootScope, $cookieStore, $timeout) {
    'ngInject';

    this.JWT = JWT;
    this.Upload = Upload;
    this.Theme = Theme;
    this.Settings = Settings;
    this.$http = $http;
    this.$state = $state;
    this.$location = $location;
    this.$q = $q;
    this.$window = $window;
    this.$timeout = $timeout;
    this.$rootScope = $rootScope;
    this.$cookieStore = $cookieStore;
    this.current = null;
    this.current_company = null;
  }

  auth(path, formData) {
    return this.$http({
      url: `${API_URL}${path}`,
      method: 'POST',
      skipAuthorization: true,
      data: formData,
    }).then((result) => {
      this.clearAuthorization();
      this.saveAuthorization(result.data);
      return result;
    });
  }

  authViaAdmin(token) {
    this.current = null;
    this.JWT.destroy();
    this.removeDefaultCompany();
    this.JWT.save({ token, refresh_token: token });
    this.loadTheme();
  }

  resetPassword(formData) {
    return this.$http({
      url: `${API_URL}/reset_password`,
      method: 'POST',
      data: formData,
    }).then(result => result);
  }

  getCurrentCompany() {
    return this.getCompany(this.getCompanyId());
  }

  setDefaultCompany(id) {
    this.current_company = this.getCompany(id);
    const currentCompanyId = this.$window.localStorage.getItem('current_company_id');

    if (id !== currentCompanyId) {
      this.$window.localStorage.setItem('current_company_id', id);
    }
  }

  getCompanyId() {
    const result = this.$window.localStorage.getItem('current_company_id');

    if (result) {
      return parseInt(result);
    }

    return null;
  }

  removeDefaultCompany() {
    this.current_company = null;
    this.$window.localStorage.removeItem('current_company_id');
  }

  getCompanies() {
    let result = [];

    if (!this.current) {
      return result;
    }

    for (let company_data of this.current.company_roles) {
      result.push(company_data.company);
    }

    for (let company of this.current.owned_companies) {
      result.push(company);
    }

    return result;
  }

  getCompany(id) {
    if (!id) {
      return null;
    }

    return this.getCompanies().filter(item => item.id === id)[0];
  }

  update(fields) {
    return this.$http({
      url: `${API_URL}/user`,
      method: 'PUT',
      data: { user: fields },
    }).then((result) => {
      this.current = result.data;
      return result.data;
    });
  }

  clearAuthorization() {
    this.current = null;
    this.$window.localStorage.removeItem('current');
    this.JWT.destroy();
    this.removeDefaultCompany();
    this.Theme.remove();
  }

  saveAuthorization(data) {
    this.JWT.save({ token: data.token, refresh_token: data.refresh_token });
  }

  logout() {
    this.clearAuthorization();
    this.$timeout(() => {
      console.log('reload to login');
      this.$state.go('auth.login', null, { reload: true });
    }, 0);
  }

  loadUserData() {
    return this.$http({
      url: `${API_URL}/user`,
      method: 'GET',
    }).then((result) => {
      this.userSuccessCallback(result);
    }, () => {
      this.userErrorCallback();
    });
  }

  userSuccessCallback(result) {
    this.current = result.data;
    this.$window.localStorage.setItem('current', JSON.stringify(this.current));

    let currentCompanyId = parseInt(this.$window.localStorage.getItem('current_company_id'), 10);
    const availableIds = this.getCompanies().map(item => item.id);

    if (availableIds.length) {
      if (!currentCompanyId || !availableIds.includes(currentCompanyId)) {
        currentCompanyId = availableIds[0];
      }

      this.setDefaultCompany(currentCompanyId);
    }

    this.loadTheme();
  }

  userErrorCallback() {
    this.JWT.destroy();
    this.removeDefaultCompany();
  }

  setCurrentUser() {
    const user = this.$window.localStorage.getItem('current');

    if (user) {
      this.current = JSON.parse(user);
    } else {
      this.loadUserData();
    }

    this.current_company = this.getCurrentCompany();
  }

  ensureAuthForClosedPages() {
    const deferred = this.$q.defer();

    if (this.JWT.get()) {
      this.setCurrentUser();
      deferred.resolve(true);
    } else {
      this.$timeout(() => {
        console.log('reload to login');
        this.$state.go('auth.login');
      });
      deferred.resolve(false);
    }

    return deferred.promise;
  }

  ensureAuthForLoginPages() {
    const deferred = this.$q.defer();

    if (this.JWT.get()) {
      this.setCurrentUser();

      this.$timeout(() => {
        console.log('reload to dashboard');
        this.$state.go('app.dashboard');
      });

      deferred.resolve(true);
    } else {
      deferred.resolve(false);
    }

    return deferred.promise;
  }

  findById(companyId, id) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/customer/find_by_id/${id}`,
      method: 'GET',
    }).then(result => result.data);
  }

  uploadPhoto(userId, file, skipJwtAuth) {
    const header = skipJwtAuth ? null : { Authorization: `Bearer ${this.JWT.get()}` };

    return this.Upload.upload({
      url: `${API_URL}/company/${this.getCompanyId()}/user/${userId}/upload`,
      data: { photo: file },
      headers: header,
    });
  }

  // move subscription methods to separate service
  startSubscription(companyId) {
    return this.$http({
      url: `${API_URL}/company/${companyId}/subscription/start`,
      method: 'POST',
    }).then(result => result.data);
  }

  finishSubscription(companyId, transactionId) {
    return this.$http({
      url: buildURL(`${API_URL}/company/${companyId}/subscription/finish`, {
        transaction_id: transactionId,
      }),
      method: 'POST',
    }).then(result => result.data);
  }

  inviteFriend(companyId, email) {
    return this.$http({
      url: `${API_URL}/company/${companyId}/subscription/invite`,
      method: 'POST',
      data: { email },
    }).then(result => result.data);
  }

  loadTheme() {
    this.Settings
      .getThemeSettings(this.getCompanyId()).then((result) => {
        const currentThemeClass = this.Theme.get();
        let themeClass = null;

        if (result.plugin_theme_name) {
          themeClass = result.plugin_theme_name.toLowerCase();
        }

        if (currentThemeClass !== themeClass) {
          this.Theme.save(themeClass);
        }
      });
  }

  isOwnerOrManager() {
    let result = false;

    if (this.isOwner()) {
      result = true;
    }

    if (this.isManager()) {
      result = true;
    }

    return result;
  }

  isOwner() {
    let result = false;

    if (this.getCompanyId() &&
      this.current &&
      this.current.owned_companies.length) {

      this.current.owned_companies.forEach((company) => {
        if (company.id === this.getCompanyId()) {
          result = true;
        }
      });
    }

    return result;
  }

  isManager() {
    let result = false;

    if (this.getCompanyId() &&
      this.current &&
      this.current.company_roles.length) {

      this.current.company_roles.forEach((role) => {
        if (role.company.id === this.getCompanyId() && role.manage_access) {
          result = true;
        }
      });
    }

    return result;
  }
}
