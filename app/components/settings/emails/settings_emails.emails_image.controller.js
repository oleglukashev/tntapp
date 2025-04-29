import cronstrue from 'cronstrue';

export default class Controller {
  constructor(User, emails_images, EmailsImage, $uibModalInstance, $rootScope) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.EmailsImage = EmailsImage;
    this.$modalInstance = $uibModalInstance;
    this.$rootScope = $rootScope;
    this.emails_images = emails_images;
    this.form_data = {
      path: null,
    };
  }

  submitForm(isValid) {
    if (!isValid) {
      return false;
    }

    this.is_submitting = true;
    this.$rootScope.show_spinner = true;

    const data = this.form_data;

    this.EmailsImage.create(this.current_company_id, data)
      .then((data) => {
        this.is_submitting = false;
        this.$rootScope.show_spinner = false;
        this.emails_images.push(data);
        this.closeModal();
      }, () => {
        this.is_submitting = false;
        this.$rootScope.show_spinner = false;
      });

    return true;
  }

  closeModal() {
    this.$modalInstance.dismiss('cancel');
  }
}
