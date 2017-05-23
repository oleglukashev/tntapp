export default class User {
  constructor(JWT, $http, $state, $q, $location, $window) {
    'ngInject';

    this.JWT             = JWT;
    this.$http           = $http;
    this.$state          = $state;
    this.$location       = $location;
    this.$q              = $q;
    this.$window         = $window;
    this.current         = null;
    this.current_company = null;
  }


  auth(path, formData) {
    return this.$http({
      url: API_URL + path,
      method: 'POST',
      data: formData
    }).then(
      (result) => {
        this.JWT.save(result.data.token);
        return result;
      }
    );
  }

  resetPassword(formData) {
    return this.$http({
      url: API_URL + '/reset_password',
      method: 'POST',
      data: formData
    }).then(
      (result) => {
        return result;
      }
    );
  }

  setDefaultCompany(id) {
    this.current_company = this.current.owned_companies.filter((item) => item.id === id)[0];
    let current_company_id = this.$window.localStorage.getItem('current_company_id');

    if (id != current_company_id) {
      this.$window.localStorage.setItem('current_company_id', id);
    }
  }

  removeDefaultCompany() {
    this.current_company = null;
    this.$window.localStorage.removeItem('current_company_id');
  }

  update(fields) {
    return this.$http({
      url:  API_URL + '/user',
      method: 'PUT',
      data: { user: fields }
    }).then(
      (result) => {
        this.current = result.data;
        return result.data;
      }
    )
  }

  logout() {
    this.current = null;
    this.JWT.destroy();
    this.removeDefaultCompany();
    this.$state.go('auth.login', null, { reload: true });
  }

  verifyAuth() {
    let deferred = this.$q.defer();

    // check for JWT token
    if (!this.JWT.get()) {
      deferred.resolve(false);
      return deferred.promise;
    }

    if (this.current) {
      deferred.resolve(true);
    } else {
      this.$http({
        url: API_URL + '/user',
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + this.JWT.get()
        }
      }).then(
        (result) => {
          this.current = result.data;

          let current_company_id = parseInt(this.$window.localStorage.getItem('current_company_id'));
          let available_ids      = this.current.owned_companies.map((item) => item.id);

          if (! current_company_id || ! available_ids.includes(current_company_id)) {
            current_company_id = this.current.owned_companies[0].id;
          }

          this.setDefaultCompany(current_company_id);

          deferred.resolve(true);
        },
        (error) => {
          this.JWT.destroy();
          this.removeDefaultCompany();
          deferred.resolve(false);
        }
      )
    }

    return deferred.promise;
  }


  ensureAuthForClosedPages() {
    let deferred = this.$q.defer();

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
    let deferred = this.$q.defer();

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
}
