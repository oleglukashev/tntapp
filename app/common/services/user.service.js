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


  tryAuth(path, formData) {
    let data = formData;

    return this.$http({
      url: this.AppConstants.api + path,
      method: 'POST',
      //headers : {'Content-Type': 'application/x-www-form-urlencoded'},
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
        if (this.$window.location.href.indexOf('register') < 0 &&
            this.$window.location.href.indexOf('reset_password') < 0
        ) {
          this.$location.path('/login')
        }

        deferred.resolve(true);
      }
    });

    return deferred.promise;
  }
}
