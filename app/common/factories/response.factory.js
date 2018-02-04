export default function ResponseFactory($q, $injector) {
  'ngInject';

  const responseInjector = {
    responseError: (rejection) => {
      if (rejection.status === 403 && rejection.statusText === 'Forbidden') {
        // hack to arround circle dependences
        const mdDialog = $injector.get('$mdDialog');
        const alert = mdDialog
          .alert()
          .title('Verwijderen')
          .textContent('Het huidige werk is niet afgerond en wordt daarom niet opgeslagen')
          .ok('Verwijderen');

        mdDialog.show(alert).then(() => {}, () => {});
      }

      return $q.reject(rejection);
    },
  };

  return responseInjector;
}
