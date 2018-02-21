export default class DashboardCtrl {
  constructor($modal) {
    'ngInject';

    this.$modal = $modal;
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
