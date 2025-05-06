import toSnakeCase from 'to-snake-case';

export default class DashboardReservationItemCtrl {
  constructor(User, UserMenu, ReservationStatus, Reservation, AppConstants, moment, $mdSidenav, $uibModal) {
    'ngInject';

    this.UserMenu = UserMenu;
    this.current_company_id = User.getCompanyId();
    this.AppConstants = AppConstants;
    this.ReservationStatus = ReservationStatus;
    this.Reservation = Reservation;
    this.$mdSidenav = $mdSidenav;
    this.$uibModal = $uibModal;
    this.moment = moment;

    this.statuses = AppConstants.reservationStatuses;
    this.lead_statuses = AppConstants.leadReservationStatuses;
    this.dutch_statuses = AppConstants.reservationDutchStatuses;
    this.status_icon = AppConstants.reservationStatusClasses;

    this.User = User;

    this.$onInit = () => {
      this.customer_id = this.data.reservation.customer ? this.data.reservation.customer.id : null
    }
  }

  openCustomerMenu(customerId, reservationPartId) {
    if (customerId) {
      this.UserMenu.loadAndSetFullData(customerId, reservationPartId);
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
      backdrop: 'static',
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
      backdrop: 'static',
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

  updateReservation() {
    this.Reservation.update(this.current_company_id, this.data.reservation.id, {
      remark: this.data.reservation.remark,
      quotation: this.data.reservation.quotation,
      last_contact: this.moment(this.data.reservation.last_contact).format('YYYY-MM-DD'),
      signed: this.data.reservation.signed,
      lead_type: this.data.reservation.lead_type,
    })
  }
}
