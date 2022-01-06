export default class Controller {
  constructor(User, Product, product, $uibModalInstance, $rootScope) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.User = User;
    this.ProductService = Product;
    this.product = product;
    this.$modalInstance = $uibModalInstance;
    this.$rootScope = $rootScope;
  }

  submitForm(isValid) {
    if (!isValid) {
      return false;
    }

    this.is_submitting = true;
    this.$rootScope.show_spinner = true;

    const data = {
      name: this.product.name,
    };

    this.ProductService.update(this.current_company_id, data, this.product.id)
      .then(() => {
        this.errors = [];
        this.is_submitting = false;
        this.$rootScope.show_spinner = false;
        this.$rootScope.$broadcast('SettingsProduct.rename_product', {
          product_id: this.product.id,
          name: this.product.name }
        );
        this.closeModal();
      }, (error) => {
        this.errors = error.data.errors.errors;
        this.is_submitting = false;
        this.$rootScope.show_spinner = false;
      });
  }

  closeModal() {
    this.$modalInstance.close();
  }
}
