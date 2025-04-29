import cronstrue from 'cronstrue';

export default class Controller {
  constructor(User, emailDeliveryId, moment, EmailsDeliverySent, $uibModalInstance, $rootScope) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.moment = moment;
    this.EmailsDeliverySent = EmailsDeliverySent;
    this.$modalInstance = $uibModalInstance;
    this.$rootScope = $rootScope;
    this.emailDeliveryId = emailDeliveryId;
    this.EmailsDeliverySent.getAll(this.current_company_id, this.emailDeliveryId)
      .then((result) => {
        console.log(result);
        this.sents = result;
        this.is_submitting = false;
        this.$rootScope.show_spinner = false;
      }, () => {
        this.is_submitting = false;
        this.$rootScope.show_spinner = false;
      });;
  }

  closeModal() {
    this.$modalInstance.dismiss('cancel');
  }
}
