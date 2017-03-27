export default class User {
  constructor(JWT, AppConstants, $http, $state, $q, $location) {
    'ngInject';

    this.JWT = JWT;
    this.AppConstants = AppConstants;
    this.$http = $http;
    this.$state = $state;
    this.$location = $location;
    this.$q = $q;

    this.current = null;
  }


  tryAuth(authType, formData) {
    let url = this.AppConstants.api + '/authenticate_check';
    let data = $.param(formData);

    if (authType == 'register') {
      url  = this.AppConstants.api + '/register';
      data = formData;
    }

    return this.$http({
      url: url,
      method: 'POST',
      headers : {'Content-Type': 'application/x-www-form-urlencoded'},
      data: data
    }).then(
      (result) => {
        this.JWT.save(result.data.token);
        return result;
      }
    );
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


  ensureAuthIs(bool) {
    let deferred = this.$q.defer();

    this.verifyAuth().then((authValid) => {
      if (authValid !== bool) {
        //this.$state.go('app.dashboard')
        this.$location.path('/')
        deferred.resolve(false);
      } else {
        this.$location.path('/login')
        deferred.resolve(true);
      }
    });

    return deferred.promise;
  }
}
