export default function reservationStatusMenu(AppConstants, ReservationStatus, filterFilter,
  moment, $modal) {
  'ngInject';

  return (that) => {
    const instance = that;

    instance.statuses = AppConstants.reservationStatuses;
    instance.dutch_statuses = AppConstants.reservationDutchStatuses;
    instance.status_icon = AppConstants.reservationStatusClasses;

    instance.changeStatus = (currentReservation, status) => {
      ReservationStatus
        .changeStatus(instance.current_company_id, currentReservation, status).then((reservation) => {
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

    instance.answer = (reservation) => {
      const modalInstance = $modal.open({
        templateUrl: 'reservation_answer.view.html',
        controller: 'ReservationAnswerCtrl as antwoord',
        size: 'md',
        resolve: {
          reservation: () => reservation,
        },
      });

      modalInstance.result.then(() => {
      }, () => {});
    };

    instance.editPart = (part) => {
      
    };
  };
}
