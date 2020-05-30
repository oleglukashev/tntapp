export default class Controller {
  constructor(moment, Reservation, $stateParams, $rootScope) {
    'ngInject';

    this.moment = moment;
    this.Reservation = Reservation;
    this.$stateParams = $stateParams;
    this.$rootScope = $rootScope;
  }

  goToPayment() {
    this.$rootScope.show_spinner = true;
    this.Reservation.getPaymentLinkBySecureToken(
      parseInt(this.$stateParams.company_id),
      parseInt(this.$stateParams.id),
      this.$stateParams.secure_token,
      ).then((data) => {
        if (data.payment_link) {
          window.location.href = data.payment_link;
        }
        this.$rootScope.show_spinner = false;
    });
  }
}
