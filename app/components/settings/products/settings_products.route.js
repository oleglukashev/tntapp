export default function routes($stateProvider) {
  'ngInject';

  $stateProvider
    .state('app.settings.products', {
      url: '/products',
      controller: 'SettingsProductsCtrl',
      controllerAs: 'products_settings',
      template: require('./settings_products.view.html'),
    })
}
