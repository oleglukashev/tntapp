export default function reservationStatusMenu(AppConstants, ReservationStatus, filterFilter,
  Customer, moment, $modal) {
  'ngInject';

  return (that) => {
    const instance = that;

    instance.statuses = AppConstants.reservationStatuses;
    instance.dutch_statuses = AppConstants.reservationDutchStatuses;
    instance.status_icon = AppConstants.reservationStatusClasses;

    instance.chooseChangeStatusMethod = (reservation, status, callaback) => {
      if (['confirmed', 'request', 'cancelled'].includes(status)) {
        instance.answer(reservation, status);
      } else {
        instance.changeStatus(reservation, status, callaback);
      }
    };

    instance.answer = (reservation, status) => {
      const modalInstance = $modal.open({
        templateUrl: 'reservation_answer.view.html',
        controller: 'ReservationAnswerCtrl as antwoord',
        size: 'md',
        resolve: {
          reservation: () => reservation,
          status: () => status,
        },
      });

      modalInstance.result.then(() => {
      }, () => {});
    };

    instance.openEditReservationModal = (reservation, reservationPart) => {
      Customer.searchReservationsByCustomerId(instance.current_company_id, reservation.customer.id)
        .then((response) => {
          const modalInstance = $modal.open({
            templateUrl: 'reservation_part.edit.view.html',
            controller: 'ReservationPartEditCtrl as reserv',
            size: 'md',
            resolve: {
              reservation: () => reservation,
              reservationPart: () => reservationPart,
              customer: () => response.customer,
              customerNotes: () => response.notes,
              customerAllergies: () => response.allergies,
              customerPreferences: () => response.preferences,
            },
          });

          modalInstance.result.then(() => {}, () => {});
        });
    };
  };
}
