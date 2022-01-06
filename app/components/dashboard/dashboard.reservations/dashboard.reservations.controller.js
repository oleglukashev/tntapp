import angular from 'angular';

export default class DashboardReservationsCtrl {
  constructor(User, ReservationStatus, ReservationItem, UserMenu, Table, Zone, filterFilter,
    moment, $scope, $rootScope, $mdSidenav, $uibModal, $window, $q) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.ReservationItem = ReservationItem; 
    this.ReservationStatus = ReservationStatus;
    this.Table = Table;
    this.UserMenu = UserMenu;
    this.Zone = Zone;
    this.filterFilter = filterFilter;
    this.$rootScope = $rootScope;
    this.$mdSidenav = $mdSidenav;
    this.$uibModal = $uibModal;
    this.$window = $window;
    this.moment = moment;
    this.zones = {};
    
    this.action_required = [];
    this.group_this_week = [];
    this.today = [];
    this.latest = [];

    this.$onChanges = () => {
      this.setData();
    }
  }

  openReservation() {
    const modalInstance = this.$uibModal.open({
      component: 'newDashboardReservation',
      size: 'md',
      animation: true,
      backdrop: 'static',
      resolve: {
        load: ['$ocLazyLoad', ($ocLazyLoad) => {
          return import(/* webpackChunkName: "new.dashboard.reservation.module" */ "../../new.dashboard.reservation")
            .then(mod => $ocLazyLoad.load({
              name: "newDashboardReservation"
            }))
            .catch(err => {
              throw new Error("Ooops, something went wrong, " + err);
            });
        }],
      },
    });

    modalInstance.result.then(() => {}, () => {});
  }

  changeStatus(reservation, status) {
    return this.ReservationStatus.changeStatus(this.current_company_id, reservation, status)
      .then((changedReservation) => {
        if (typeof this.action_required !== 'undefined') {
          const requiredReservation = this
            .action_required
            .filter(item => item.reservation.id === changedReservation.id)[0];

          if (changedReservation.status === 'request') {
            if (!requiredReservation) {
              ['action_required', 'group_this_week', 'today', 'latest'].forEach((blockTitle) => {
                this[blockTitle].forEach((reservationData) => {
                  if (reservationData.reservation.id === changedReservation.id) {
                    const part = reservationData.part;
                    this.action_required.push(this.ReservationItem.prepareData(part, reservation, this.zones));
                  }
                });
              });
            }
          } else {
            if (requiredReservation) {            
              for(let i = this.action_required.length -1; i >= 0 ; i--) {
                if (this.action_required[i].reservation.id === changedReservation.id) {
                  this.action_required.splice(i, 1);
                }
              };
            }
          }

          this.changeStatusInAllBlocks(changedReservation.id, status);
        }
      });
  }

  changeStatusInAllBlocks(reservationId, status) {
    ['action_required', 'group_this_week', 'today', 'latest'].forEach((blockTitle) => {
      const partData = this[blockTitle].filter(item => item.reservation.id === reservationId)[0];

      if (partData) {
        partData.reservation.status = status;

        this[blockTitle].forEach((dataItem, index) => {
          if (dataItem.reservation.id === reservationId) {
            this[blockTitle][index] = this.ReservationItem.prepareData(dataItem.part, dataItem.reservation, this.zones);
          }
        });
      }
    });
  }

  openCustomerMenu(customerId, reservationPartId) {
    if (customerId) {
      if (!UserMenu.isCurrentCustomer(customerId)) {
        UserMenu.loadAndSetFullData(customerId, reservationPartId);
      }

      this.$mdSidenav('right').open();
    }
  };

  setData() {
    ['action_required', 'group_this_week', 'today', 'latest'].forEach((item) => {
      const result = [];
      const tempData = this.reservations[item];
      tempData.forEach((reservation) => {
        reservation.reservation_parts.forEach((part) => {
          result.push(this.ReservationItem.prepareData(part, reservation, this.zones));
        });
      });

      this[item] = result;
    });
  }

  hasReservations() {
    return this.action_required.length
      || this.group_this_week.length
      || this.today.length
      || this.latest.length;
  }
}
