export default function reservationStatusMenu(AppConstants, ReservationStatus, filterFilter,
  Customer, UserMenu, moment, $uibModal) {
  'ngInject';

  return (that) => {
    const instance = that;

    instance.statuses = AppConstants.reservationStatuses;
    instance.dutch_statuses = AppConstants.reservationDutchStatuses;
    instance.status_icon = AppConstants.reservationStatusClasses;
    instance.UserMenu = UserMenu;

    instance.chooseChangeStatusMethod = (reservation, status, callaback) => {
      if (['confirmed', 'request', 'cancelled'].includes(status)) {
        instance.answer(reservation, status);
      } else {
        instance.changeStatus(reservation, status, callaback);
      }
    };

    instance.answer = (reservation, status) => {
      const modalInstance = $uibModal.open({
        templateUrl: 'reservation_answer.view.html',
        controller: 'ReservationAnswerCtrl as antwoord',
        size: 'md',
        backdrop: 'static',
        resolve: {
          reservation: () => reservation,
          status: () => status,
        },
      });

      modalInstance.result.then(() => {
      }, () => {});
    };

    instance.openEditReservationModal = (reservation, reservationPart) => {
      const modalInstance = $uibModal.open({
        templateUrl: 'edit_reservation.view.html',
        controller: 'EditReservationCtrl as reserv',
        size: 'md',
        backdrop: 'static',
        resolve: {
          reservationPart: () => reservationPart,
          reservation: () => reservation,
        },
      });

      modalInstance.result.then(() => {}, () => {});
    };
  };
}
