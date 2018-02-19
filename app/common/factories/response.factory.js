export default function ResponseFactory($q, $injector) {
  'ngInject';

  const responseInjector = {
    responseError: (rejection) => {
      if (rejection.status === 403) {
        // hack to arround circle dependences

        const mdDialog = $injector.get('$mdDialog');
        const alert = mdDialog
          .alert()
          .title('Geen toegang')
          .textContent('U heeft geen toegang tot deze pagina omdat u hiervoor geen rechten heeft.')
          .ok('Sluiten');

        mdDialog.show(alert).then(() => {}, () => {});
      }

      return $q.reject(rejection);
    },
  };

  return responseInjector;
}
