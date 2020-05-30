export default class Controller {
  constructor(moment, $stateParams, $rootScope, Reservation) {
    'ngInject';

    this.$stateParams = $stateParams;
    $rootScope.show_spinner = true;

    Reservation
      .checkBySecureToken(
        parseInt($stateParams.company_id),
        parseInt($stateParams.id),
        $stateParams.secure_token
      )
      .then((data) => {
        this.reservation = data;
        $rootScope.show_spinner = false;
      });
  }

  goToNewReservation() {
    window.location.href = `/reservation/${this.$stateParams.company_id}/`;
  }
}
