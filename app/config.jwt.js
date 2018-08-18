export default function Config($httpProvider, jwtOptionsProvider) {
  'ngInject';

  jwtOptionsProvider.config({
    whiteListedDomains: ['tnt.me', 'thenexttable.com'],
    tokenGetter: ['options', 'jwtHelper', '$http', 'JWT', '$state', 'moment', 'User',
      (options, jwtHelper, $http, JWT, $state, moment, User) => {
      // Skip authentication for any requests ending in .html
        if (options.url.substr(options.url.length - 5) === '.html') {
          return null;
        }

        const clearAuthorizationAndGoToLogin = () => {
          User.clearAuthorization();
          $state.go('auth.login');
        };

        const token = JWT.get();

        // TODO find more good solution
        const isntAuthPage = $state.current.name !== '' &&
          $state.current.name !== 'customer_reservation.new' &&
          $state.current.name.indexOf('auth') < 0;

        if (token) {
          const tokenExpMoment = moment.unix(jwtHelper.decodeToken(token).exp);
          const expSoon = moment().add(1, 'minute') > tokenExpMoment;

          if (jwtHelper.isTokenExpired(token) || expSoon) {
            const refreshToken = JWT.getRefreshToken();

            if (refreshToken) {
              return $http({
                url: `${API_URL}/token/refresh`,
                method: 'POST',
                skipAuthorization: true,
                data: {
                  refresh_token: refreshToken,
                },
              }).then((result) => {
                JWT.save({ token: result.data.token, refresh_token: result.data.refresh_token });
                return JWT.get();
              }, () => {
                if (isntAuthPage) {
                  clearAuthorizationAndGoToLogin();
                }
              });
            }

            if (isntAuthPage) {
              clearAuthorizationAndGoToLogin();
            }

            return null;
          }

          return token;
        }

        if (isntAuthPage) {
          clearAuthorizationAndGoToLogin();
        }

        return null;
      }],
  });

  $httpProvider.interceptors.push('jwtInterceptor');
}
