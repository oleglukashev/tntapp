import cronstrue from 'cronstrue';

export default class Controller {
  constructor(User, item, placeholders, Placeholder, $uibModalInstance, $rootScope) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Placeholder = Placeholder;
    this.$modalInstance = $uibModalInstance;
    this.$rootScope = $rootScope;
    this.item = Object.assign({}, item);
    this.form_data = Object.assign({}, item);
    this.placeholders = placeholders;
  }

  submitForm(isValid) {
    if (!isValid) {
      return false;
    }

    this.is_submitting = true;
    this.$rootScope.show_spinner = true;

    const data = {
      title_en: this.form_data.title_en,
      title_nl: this.form_data.title_nl,
      content_en: this.form_data.content_en,
      content_nl: this.form_data.content_nl,
    };

    if (this.item.id) {
      this.Placeholder.update(this.current_company_id, data, this.item.id)
        .then((data) => {
          this.is_submitting = false;
          this.$rootScope.show_spinner = false;
          this.placeholders[this.placeholders.findIndex(item => item.id === this.item.id)] = data;
          this.closeModal();
        }, () => {
          this.is_submitting = false;
          this.$rootScope.show_spinner = false;
        });
    } else {
      this.Placeholder.create(this.current_company_id, data)
        .then((data) => {
          this.is_submitting = false;
          this.$rootScope.show_spinner = false;
          this.placeholders.push(data);
          this.closeModal();
        }, () => {
          this.is_submitting = false;
          this.$rootScope.show_spinner = false;
        });
    }

    return true;
  }

  closeModal() {
    this.$modalInstance.dismiss('cancel');
  }
}
