export default function reservationStatusMenu(ReservationStatus, filterFilter, moment, $modal) {
  'ngInject';

  return (that) => {
    that.changeStatus = (currentReservation, status) => {
      ReservationStatus
        .changeStatus(that.current_company_id, currentReservation, status).then((reservation) => {
          if (that.action_required) {
            const datetime = reservation.reservation_parts[0];
            const actionRequiredHasReservation =
              filterFilter(that.action_required, { id: reservation.id })[0];

            if (reservation.status === 'request' &&
                datetime &&
                moment(datetime) >= that.moment()) {
              if (!actionRequiredHasReservation) {
                that.action_required.push(reservation);
              }
            } else {
              const index = that.action_required.map(item => item.id).indexOf(reservation.id);

              if (actionRequiredHasReservation) {
                that.action_required.splice(index, 1);
              }
            }
          }
        }, () => {});
    };

    that.answer = (reservation) => {
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
  };
}
