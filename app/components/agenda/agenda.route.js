export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('app.agenda', {
      url: '/agenda',
      template: require('./agenda.view.html'),
      controller: 'AgendaCtrl',
      controllerAs: 'agenda'
    })
}
