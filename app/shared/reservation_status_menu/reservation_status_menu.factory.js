export default function reservationStatusMenu(
  AppConstants, ReservationStatus, filterFilter, moment, $modal,
  Loaded,
) {
  'ngInject';

  return (that) => {
    const instance = that;

    instance.statuses = AppConstants.reservationStatuses;
    instance.dutch_statuses = AppConstants.reservationDutchStatuses;
    instance.status_icon = AppConstants.reservationStatusClasses;

    instance.changeLoadedStatus = (id, status) => {
      // FIXME: temporary decision, use data models for reservations
      const item = Loaded.reservations.today.filter(obj => obj.reservation.id === id)[0];
      if (item) {
        item.reservation.status = status;
        Loaded.$rootScope.$broadcast('reservationsLoaded');
      }
    };

    instance.changeStatus = (currentReservation, status, hidePopup) => {
      if (status === 'cancelled' && !hidePopup) {
        instance.answer(currentReservation, true);
        return;
      }

      ReservationStatus
        .changeStatus(instance.current_company_id, currentReservation, status).then((reservation) => {
          instance.changeLoadedStatus(currentReservation.id, status);
          if (typeof instance.action_required !== 'undefined') {
            const reservations = instance.all_reservations.action_required;
            const actionRequiredReservation = filterFilter(reservations, { id: reservation.id })[0];


            if (reservation.status === 'request') {
              if (!actionRequiredReservation) reservations.push(reservation);
            } else {
              const index = instance.action_required.map(item => item.id).indexOf(reservation.id);
              if (actionRequiredReservation) reservations.splice(index, 1);
            }
          }

          if (instance.setData) instance.setData();
          if (instance.setGraphData) instance.setGraphData();
        }, () => {});
    };

    instance.answer = (reservation, isCancellingReservation) => {
      const modalInstance = $modal.open({
        templateUrl: 'reservation_answer.view.html',
        controller: 'ReservationAnswerCtrl as antwoord',
        size: 'md',
        resolve: {
          reservation: () => reservation,
          isCancellingReservation: () => isCancellingReservation,
        },
      });

      modalInstance.result.then(() => {
      }, () => {});
    };

    instance.editPart = (part) => {

    };
  };
}
