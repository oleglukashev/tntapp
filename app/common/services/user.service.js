export default class User {
  constructor(JWT, AppConstants, $http, $state, $q, $location, $window) {
    'ngInject';

    this.JWT = JWT;
    this.AppConstants = AppConstants;
    this.$http = $http;
    this.$state = $state;
    this.$location = $location;
    this.$q = $q;
    this.$window = $window;

    this.current = null;
  }


  auth(path, formData) {
    return this.$http({
      url: this.AppConstants.api + path,
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
      url: this.AppConstants.api + '/reset_password',
      method: 'POST',
      data: formData
    }).then(
      (result) => {
        return result;
      }
    );
  }

  setDefaultCompany(id) {
    this.currentCompany = this.current.owned_companies.filter((item) => item.id === id)[0];
  }

  update(fields) {
    return this.$http({
      url:  this.AppConstants.api + '/user',
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
        url: this.AppConstants.api + '/user',
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + this.JWT.get()
        }
      }).then(
        (result) => {
          this.current = result.data;
          this.setDefaultCompany(this.current.owned_companies[0].id);

          deferred.resolve(true);
        },
        (error) => {
          this.JWT.destroy();
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
