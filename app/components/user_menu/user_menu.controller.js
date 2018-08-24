import angular from 'angular';
import toSnakeCase from 'to-snake-case';

import integrationReservationController from './user_menu.integration_reservation.controller';
import integrationReservationView from './user_menu.integration_reservation.view.html';

export default class Controller {
  constructor(User, Reservation, AppConstants, ReservationPart, Customer, UserMenu, moment, $scope,
    $mdSidenav, $uibModal, $mdDialog) {
    'ngInject';

    this.currentCompanyId = User.getCompanyId();

    this.Reservation = Reservation;
    this.ReservationPart = ReservationPart;
    this.AppConstants = AppConstants;

    this.moment = moment;
    this.Customer = Customer;
    this.UserMenu = UserMenu;
    this.$mdSidenav = $mdSidenav;
    this.$uibModal = $uibModal;
    this.$mdDialog = $mdDialog;
  }

  loadPDF(reservationId) {
    this.Reservation
      .getPDF(this.currentCompanyId, reservationId)
      .then();
  }

  openEditReservationModal(reservation, reservationPart) {
    const modalInstance = this.$uibModal.open({
      component: 'editReservationComponent',
      size: 'md',
      resolve: {
        reservation: () => angular.copy(reservation),
        reservationPart: () => angular.copy(reservationPart),
        load: ['$ocLazyLoad', ($ocLazyLoad) => {
          return import(/* webpackChunkName: "edit.reservation.module" */ "../edit.reservation")
            .then(mod => $ocLazyLoad.load({
              name: 'editReservation',
            }))
            .catch(err => {
              throw new Error("Ooops, something went wrong, " + err);
            });
        }],
      },
    });

    modalInstance.result.then(() => {}, () => {});
  }

  openEditModal() {
    const modalInstance = this.$uibModal.open({
      component: 'editUserMenu',
      size: 'md',
      resolve: {
        load: ['$ocLazyLoad', ($ocLazyLoad) => {
          return import(/* webpackChunkName: "edit.user_menu.module" */ "./edit.user_menu")
            .then(mod => $ocLazyLoad.load({
              name: 'editUserMenu',
            }))
            .catch(err => {
              throw new Error("Ooops, something went wrong, " + err);
            });
        }],
      },
    });

    modalInstance.result.then(() => {}, () => {});
  }

  toggleStar(customer) {
    const data = {
      first_name: customer.first_name,
      last_name: customer.last_name,
      primary_phone_number: customer.primary_phone_number,
      secondary_phone_number: customer.secondary_phone_number,
      street: customer.street,
      country: customer.country,
      house_number: customer.house_number,
      zipcode: customer.zipcode,
      city: customer.city,
      mail: customer.mail,
      date_of_birth: customer.date_of_birth,
      gender: customer.gender,
      regular: !customer.regular,
    };

    this.Customer.edit(this.currentCompanyId, customer.id, data).then((customerData) => {
      this.UserMenu.customer = customerData;
    });
  }

  closeCustomerMenu() {
    this.$mdSidenav('right').close();
  }

  parsedDate(date) {
    return this.moment(date).locale('nl').format('D MMMM YYYY HH:mm');
  }

  getPartByReservations() {
    return this.ReservationPart.partsByReservations(this.UserMenu.reservations);
  }

  getAllergyClass(name) {
    return this.AppConstants.allergyClasses[toSnakeCase(name)];
  }

  openIntegrationReservationByPart($event, inReserv) {
    $event.preventDefault();
    $event.stopPropagation();


    this.$mdDialog.show({
      controller: integrationReservationController,
      controllerAs: 'ctrl',
      template: integrationReservationView,
      targetEvent: $event,
      clickOutsideToClose: true,
      locals: {
        inReserv: angular.copy(inReserv),
      },
    });
  }
}
