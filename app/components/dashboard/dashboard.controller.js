export default class DashboardCtrl {
  constructor(User, Settings, $modal, $mdDialog, $modalStack, $stateParams, $state, $translate) {
    'ngInject';

    // Close all others windows
    $modalStack.dismissAll();

    this.current_company_id = User.getCompanyId();

    this.$modal = $modal;
    this.$state = $state;
    this.$modalStack = $modalStack;
    this.$mdDialog = $mdDialog;
    this.Settings = Settings;

    const senderEmailToken = $stateParams.sender_email_token;

    if (senderEmailToken) {
      this.Settings.confirmSenderEmail(this.current_company_id, senderEmailToken).then((result) => {
        const alert = this.$mdDialog.alert()
          .title(this.sender_email_title)
          .textContent(this.sender_email_text)
          .ok('Ok')

        this.$mdDialog.show(alert).then(() => {}, () => {});
      });
    }

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
  }

  openReservation() {
    const modalInstance = this.$modal.open({
      templateUrl: 'dashboard_reservations.new.view.html',
      controller: 'DashboardReservationsReservationCtrl as dash_reserv',
      size: 'md',
    });

    modalInstance.result.then(() => {}, () => {});
  }

  openInvitePopup() {
    const modalInstance = this.$modal.open({
      templateUrl: 'dashboard_invite.view.html',
      controller: 'DashboardInviteCtrl as dash_invite',
      size: 'md',
    });

    modalInstance.result.then(() => {}, () => {});
  }
}
