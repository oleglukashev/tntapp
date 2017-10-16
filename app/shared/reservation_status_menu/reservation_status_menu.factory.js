export default function reservationStatusMenu(ReservationStatus, filterFilter, moment, $modal) {
  'ngInject';

  return (that) => {
    that.changeStatus = (currentReservation, status) => {
      ReservationStatus
        .changeStatus(that.current_company_id, currentReservation, status).then((reservation) => {
          if (typeof that.action_required !== 'undefined') {
            const reservations = ReservationStatus
              .translateAndcheckStatusForDelay(that.all_reservations.action_required);
            const actionRequiredReservation = filterFilter(reservations, { id: reservation.id })[0];

            if (reservation.status === 'request') {
              if (!actionRequiredReservation) reservations.push(reservation);
            } else {
              const index = that.action_required.map(item => item.id).indexOf(reservation.id);
              if (actionRequiredReservation) reservations.splice(index, 1);
            }
          }

          if (that.setTableOptions) that.setTableOptions();
          if (that.setData) that.setData();
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

    that.setPresent = (reservation) => {
      that.ReservationStatus.setPresent(
        that.current_company_id,
        reservation,
        !reservation.is_present,
      ).then(() => {
        if (that.setTableOptions) that.setTableOptions();
        if (that.setData) that.setData();
      });
    };
  };
}
