import toSnakeCase from 'to-snake-case';

export default class DashboardReservationItemCtrl {
  constructor(UserMenu, ReservationStatus, AppConstants, $mdSidenav, $uibModal) {
    'ngInject';

    this.UserMenu = UserMenu;
    this.AppConstants = AppConstants;
    this.ReservationStatus = ReservationStatus;
    this.$mdSidenav = $mdSidenav;
    this.$uibModal = $uibModal;

    this.statuses = AppConstants.reservationStatuses;
    this.dutch_statuses = AppConstants.reservationDutchStatuses;
    this.status_icon = AppConstants.reservationStatusClasses;

    this.$onInit = () => {
      this.customer_id = this.data.reservation.customer ? this.data.reservation.customer.id : null
    }
  }

  openCustomerMenu(customerId, reservationPartId) {
    if (customerId) {
      if (!this.UserMenu.isCurrentCustomer(customerId)) {
        this.UserMenu.loadAndSetFullData(customerId, reservationPartId);
      }

      this.$mdSidenav('right').open();
    }
  }

  chooseChangeStatusMethod(reservation, status, callaback) {
    if (['confirmed', 'request', 'cancelled'].includes(status)) {
      this.answer(reservation, status);
    } else {
      this.changeStatus({reservation, status});
    }
  }

  answer(reservation, status) {
    const modalInstance = this.$uibModal.open({
      component: 'reservationAnswerComponent',
      size: 'md',
      resolve: {
        reservation: () => reservation,
        status: () => status,
        changeStatus: () => this.changeStatus,
        load: ['$ocLazyLoad', ($ocLazyLoad) => {
          return import(/* webpackChunkName: "reservation.answer.module" */ "../reservation.answer")
            .then(mod => $ocLazyLoad.load({
              name: "reservationAnswer"
            }))
            .catch(err => {
              throw new Error("Ooops, something went wrong, " + err);
            });
        }],
      },
    });

    modalInstance.result.then(() => {}, () => {});
  }

  openEditReservationModal(reservation, reservationPart) {
    const modalInstance = this.$uibModal.open({
      component: 'editReservationComponent',
      size: 'md',
      resolve: {
        reservationPart: () => reservationPart,
        reservation: () => reservation,
        load: ['$ocLazyLoad', ($ocLazyLoad) => {
          return import(/* webpackChunkName: "edit.reservation.module" */ "../edit.reservation")
            .then(mod => $ocLazyLoad.load({
              name: "editReservation"
            }))
            .catch(err => {
              throw new Error("Ooops, something went wrong, " + err);
            });
        }],
      },
    });

    modalInstance.result.then(() => {}, () => {});
  }

  getAllergyClass(name) {
    return this.AppConstants.allergyClasses[toSnakeCase(name)];
  }
}
