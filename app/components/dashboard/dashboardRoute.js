import layout from '../../components/layout/app.html'

routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  alert(2);
  $stateProvider
    .state('app.dashboard', {
      url: '/dashboard',
      template: layout
    });
}