export default class User {
  constructor(JWT, Upload, Settings, $http, $state, $q, $location, $window, $rootScope, $cookieStore) {
    'ngInject';

    this.JWT = JWT;
    this.Upload = Upload;
    this.Settings = Settings;
    this.$http = $http;
    this.$state = $state;
    this.$location = $location;
    this.$q = $q;
    this.$window = $window;
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
    }).then(
      (result) => {
        this.JWT.save({ token: result.data.token, refresh_token: result.data.refresh_token });
        return result;
      },
    );
  }

  authViaAdmin(token) {
    this.current = null;
    this.JWT.destroy();
    this.removeDefaultCompany();
    this.JWT.save({ token: token, refresh_token: token });
  }

  resetPassword(formData) {
    return this.$http({
      url: `${API_URL}/reset_password`,
      method: 'POST',
      data: formData,
    }).then(result => result);
  }

  setDefaultCompany(id) {
    this.current_company = this.getCompany(id);
    const currentCompanyId = this.$window.localStorage.getItem('current_company_id');

    if (id !== currentCompanyId) {
      this.$window.localStorage.setItem('current_company_id', id);
    }
  }

  getCompanyId() {
    return this.current_company ? this.current_company.id : null;
  }

  getCompanies() {
    let result = [];

    for (let company_data of this.current.company_roles) {
      result.push(company_data.company);
    }

    for (let company of this.current.owned_companies) {
      result.push(company);
    }

    return result;
  }

  getCompany(id) {
    return this.getCompanies().filter(item => item.id === id)[0];
  }

  removeDefaultCompany() {
    this.current_company = null;
    this.$window.localStorage.removeItem('current_company_id');
  }

  update(fields) {
    return this.$http({
      url: `${API_URL}/user`,
      method: 'PUT',
      data: { user: fields },
    }).then(
      (result) => {
        this.current = result.data;
        return result.data;
      },
    );
  }

  logout() {
    this.current = null;
    this.JWT.destroy();
    this.removeDefaultCompany();
    this.$state.go('auth.login', null, { reload: true });
  }

  verifyAuth() {
    let deferred = this.$q.defer();

    if (!this.JWT.get()) {
      deferred.resolve(false);
      return deferred.promise;
    }

    if (this.current) {
      deferred.resolve(true);
    } else {
      this.$http({
        url: `${API_URL}/user`,
        method: 'GET',
      }).then(
        (result) => {
          this.current = result.data;

          let currentCompanyId = parseInt(this.$window.localStorage.getItem('current_company_id'), 10);
          const availableIds = this.getCompanies().map(item => item.id);

          if (availableIds.length) {
            if (!currentCompanyId || !availableIds.includes(currentCompanyId)) {
              currentCompanyId = availableIds[0];
            }

            this.setDefaultCompany(currentCompanyId);
            this.loadTheme();
          }

          deferred.resolve(true);
        },
        () => {
          this.JWT.destroy();
          this.removeDefaultCompany();
          deferred.resolve(false);
        },
      );
    }

    return deferred.promise;
  }

  ensureAuthForClosedPages() {
    const deferred = this.$q.defer();

    this.verifyAuth().then((authValid) => {
      if (authValid === true) {
        deferred.resolve(true);
      } else {
        this.$state.go('auth.login');
        deferred.resolve(false);
      }
    });

    return deferred.promise;
  }

  ensureAuthForLoginPages() {
    const deferred = this.$q.defer();

    this.verifyAuth().then((authValid) => {
      if (authValid === true) {
        this.$state.go('app.dashboard');
        deferred.resolve(true);
      } else {
        deferred.resolve(false);
      }
    });

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

  uploadPhoto(userId, file) {
    const header = skipJwtAuth ? null : { Authorization: `Bearer ${this.JWT.get()}` };

    return this.Upload.upload({
      url: `${API_URL}/company/${this.current_company.id}/user/${userId}/upload`,
      data: { photo: file },
      headers: header,
    });
  }

  getPhoto(userId) {
    const deferred = this.$q.defer();

    if (!this.current_company) {
      return deferred.promise;
    }

    return this.$http({
      url: `${API_URL}/company/${this.current_company.id}/user/${userId}/photo?${new Date().getTime()}`,
      method: 'GET',
      ignoreLoadingBar: true,
      headers: {
        Authorization: `Bearer ${this.JWT.get()}`,
      },
    }).then(result => result.data);
  }

  loadTheme() {
    this.Settings
      .getThemeSettings(this.current_company.id).then(
        (result) => {
          const currentTheme = this.$cookieStore.get('theme');
          let themeClass = null;

          if (result.plugin_theme_name) {
            themeClass = `${result.plugin_theme_name.toLowerCase()}-theme`;
          }

          if (currentTheme != themeClass) {
            this.Settings.saveThemeToCookie(themeClass);
            this.$rootScope.$broadcast('AppCtrl.change_plugin_theme_name', themeClass);
          }
        });
  }
}
