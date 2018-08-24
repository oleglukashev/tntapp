import dashboardInviteController from './dashboard.invite/dashboard.invite.controller';
import dashboardInviteView from './dashboard.invite/dashboard.invite.view.html';
import dashboardSubscriptionProcessController
  from './dashboard.subscription/dashboard.subscription.process.controller';

export default class DashboardCtrl {
  constructor(User, Reservation, Zone, Settings, $uibModal, $mdDialog, $uibModalStack, $stateParams, $translate,
    $scope, $q) {
    'ngInject';

    // Close all others windows
    $uibModalStack.dismissAll();

    this.current_company_id = User.getCompanyId();

    this.$uibModal = $uibModal;
    this.Reservation = Reservation;
    this.Zone = Zone;
    this.zones = {};

    const status = $stateParams.status;
    const iban = $stateParams.iban;
    const senderEmailToken = $stateParams.sender_email_token;

    if (status && status !== 'pending') {
      this.openProcessPopup(status, iban);
    }

    if (senderEmailToken) {
      Settings.confirmSenderEmail(senderEmailToken).then(() => {
        const alert = $mdDialog.alert()
          .title(this.sender_email_title)
          .textContent(this.sender_email_text)
          .ok('Ok');

        $mdDialog.show(alert).then(() => {}, () => {});
      });
    }

    $scope.$on('NewReservationCtrl.reload_reservations', () => {
      this.Reservation.getAllGrouped(this.current_company_id).then((reservations) => {
        this.initReservations(reservations);
      });
    });

    // run translates
    this.sender_email_title = '';
    this.sender_email_text = '';
    $translate(['congratulations', 'dashboard.sender_email_text']).then((translate) => {
      this.sender_email_title = translate.congratulations;
      this.sender_email_text = translate['dashboard.sender_email_text'];
    }, (translationIds) => {
      this.sender_email_title = translationIds.congratulations;
      this.sender_email_text = translationIds['dashboard.sender_email_text'];
    });

    $q.all([
      this.Zone.getAll(this.current_company_id),
      this.Reservation.getAllGrouped(this.current_company_id),
    ]).then((result) => {
      this.initZones(result[0]);
      this.initReservations(result[1]);
    });
  }

  openInvitePopup() {
    const modalInstance = this.$uibModal.open({
      component: 'dashboardInviteComponent',
      size: 'md',
    });

    modalInstance.result.then(() => {}, () => {});
  }

  openProcessPopup(status, iban) {
    const modalInstance = this.$uibModal.open({
      windowClass: 'subscription-modal',
      templateUrl: `dashboard_subscription.${status}.view.html`,
      controller: dashboardSubscriptionProcessController,
      controllerAs: 'dash_subscription',
      size: 'md',
      resolve: {
        iban: () => iban,
      },
    });

    modalInstance.result.then(() => {}, () => {});
  }

  initReservations(reservations) {
    this.reservations = reservations;
  }

  initZones(zones) {
    this.zones = {};
    zones.forEach((zone) => {
      this.zones[zone.id] = zone;
    });
  }
}
