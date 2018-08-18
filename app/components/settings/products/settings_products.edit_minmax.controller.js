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
      min_persons: this.product.min_persons,
      max_persons: this.product.max_persons,
    };

    this.ProductService.update(this.current_company_id, data, this.product.id)
      .then(() => {
        this.errors = [];
        this.is_submitting = false;
        this.$rootScope.show_spinner = false;
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
