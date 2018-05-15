export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('app.customers', {
      url: '/customers',
      template: require('./customer.view.html'),
      controller: 'CustomerCtrl',
      controllerAs: 'customer',
    });
}
