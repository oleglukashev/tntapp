export default function Config($httpProvider, jwtOptionsProvider) {
  'ngInject';

  jwtOptionsProvider.config({
    whiteListedDomains: ['tnt.me', 'thenexttable.com'],
    tokenGetter: ['jwtHelper', '$http', 'JWT', '$state', (jwtHelper, $http, JWT, $state) => {
      const token = JWT.get();

      const isAuthPage = $state.current.name !== '' && $state.current.name.indexOf('auth') < 0;

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
                if (isAuthPage) window.location.reload();
              },
            );
          }

          if (isAuthPage) window.location.reload();
          return null;
        }

        return token;
      }

      if (isAuthPage) window.location.reload();
      return null;
    }],
  });

  $httpProvider.interceptors.push('jwtInterceptor');
}
