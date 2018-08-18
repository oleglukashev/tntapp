import angular from 'angular';
import controller from './new_reservation.controller';
import view from './new_reservation.view.html';

import TypeNewReservationTab from './type.new_reservation_tab';
import DateNewReservationTab from './date.new_reservation_tab';
import NumberOfPersonsNewReservationTab from './number_of_persons.new_reservation_tab';
import ProductNewReservationTab from './product.new_reservation_tab';
import TimeNewReservationTab from './time.new_reservation_tab';
import ZoneNewReservationTab from './zone.new_reservation_tab';
import GroupNewReservationTab from './group.new_reservation_tab';
import PersonNewReservationTab from './person.new_reservation_tab';

import SuccessNewReservation from '../success.new_reservation';

export default angular.module('newReservation', [
  TypeNewReservationTab,
  DateNewReservationTab,
  NumberOfPersonsNewReservationTab,
  ProductNewReservationTab,
  TimeNewReservationTab,
  ZoneNewReservationTab,
  GroupNewReservationTab,
  PersonNewReservationTab,
  SuccessNewReservation])
  .component('newReservation', {
    controller,
    controllerAs: 'ctrl',
    template: view,
    bindings: {
      type: '@',
    },
  })
  .name;
