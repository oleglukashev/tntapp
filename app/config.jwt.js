export default function Config($httpProvider, jwtOptionsProvider) {
  jwtOptionsProvider.config({
    whiteListedDomains: ['tnt.me'],
    tokenGetter: ['jwtHelper', '$http', 'JWT', 'User', function(jwtHelper, $http, JWT, User) {
      var token = JWT.get();

      if (token) {
        if (jwtHelper.isTokenExpired(token)) {
          var refresh_token = JWT.getRefreshToken();

          if (refresh_token) {
            return $http({
              url: API_URL + '/token/refresh',
              method: 'POST',
              skipAuthorization: true,
              data: {
                refresh_token: refresh_token
              }
            }).then(
              (result) => {
                JWT.save({ token: result.data.token, refresh_token: result.data.refresh_token });
                return JWT.get();
              }
            );
          } else {
            return null;
          }
        } else {
          return token;
        }
      } else {
        return null;
      }
    }]
  });

  $httpProvider.interceptors.push('jwtInterceptor');
}