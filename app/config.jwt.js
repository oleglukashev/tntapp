export default function Config($httpProvider, jwtOptionsProvider) {
  'ngInject';

  jwtOptionsProvider.config({
    whiteListedDomains: ['tnt.me', 'thenexttable.com'],
    tokenGetter: ['jwtHelper', '$http', 'JWT', '$state', '$window', (jwtHelper, $http, JWT, $state, $window) => {
      const token = JWT.get();

      // TODO find more good solution
      const isntAuthPage = $state.current.name !== '' &&
        $state.current.name !== 'customer_reservation.new' &&
        $state.current.name.indexOf('auth') < 0;

      if (token) {
        if (jwtHelper.isTokenExpired(token)) {
          const refreshToken = JWT.getRefreshToken();

          if (refreshToken) {
            return $http({
              url: `${API_URL}/token/refresh`,
              method: 'POST',
              skipAuthorization: true,
              data: {
                refresh_token: refreshToken,
              },
            }).then(
              (result) => {
                JWT.save({ token: result.data.token, refresh_token: result.data.refresh_token });
                return JWT.get();
              }, () => {
                if (isntAuthPage) $window.location.href = '/';
              },
            );
          }

          if (isntAuthPage) $window.location.href = '/';
          return null;
        }

        return token;
      }

      if (isntAuthPage) $window.location.href = '/';
      return null;
    }],
  });

  $httpProvider.interceptors.push('jwtInterceptor');
}
