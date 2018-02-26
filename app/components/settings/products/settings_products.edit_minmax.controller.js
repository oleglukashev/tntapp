export default class SettingsProductsEditMinMaxCtrl {
  constructor(User, Product, product, $modalInstance) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.User = User;
    this.ProductService = Product;
    this.product = product;
    this.$modalInstance = $modalInstance;
  }

  submitForm() {
    const data = {
      min_persons: this.product.min_persons,
      max_persons: this.product.max_persons,
    };

    this.ProductService.update(this.current_company_id, data, this.product.id)
      .then(() => {
        this.errors = [];
      }, (error) => {
        this.errors = error.data.errors.errors;
      });
  }

  closeModal() {
    this.$modalInstance.close();
  }
}
