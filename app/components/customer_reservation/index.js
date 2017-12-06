import angular from 'angular';
import routing from './customer_reservation.route';
import controller from './customer_reservation.controller';
import newReservationDateFactory from '../new_reservation/new_reservation.date.factory';
import newReservationGroupFactory from '../new_reservation/new_reservation.group.factory';
import newReservationNumberOfPersonsFactory
  from '../new_reservation/new_reservation.number_of_persons.factory';
import newReservationPersonAutocompleteFactory
  from '../new_reservation/new_reservation.person.autocomplete.factory';
import newReservationPersonFactory from '../new_reservation/new_reservation.person.factory';
import newReservationProductFactory from '../new_reservation/new_reservation.product.factory';
import newReservationTimeFactory from '../new_reservation/new_reservation.time.factory';
import newReservationTypeFactory from '../new_reservation/new_reservation.type.factory';
import newReservationZoneFactory from '../new_reservation/new_reservation.zone.factory';

export default angular.module('app.customer_reservation', [])
  .config(routing)
  .controller('CustomerReservationCtrl', controller)
  .factory('NewReservationDateFactory', newReservationDateFactory, ['moment', '$mdDialog', '$q'])
  .factory('NewReservationGroupFactory', newReservationGroupFactory, [])
  .factory('NewReservationNumberOfPersonsFactory', newReservationNumberOfPersonsFactory, ['Reservation'])
  .factory('NewReservationPersonAutocompleteFactory', newReservationPersonAutocompleteFactory,
    ['Customer', '$timeout'])
  .factory('NewReservationPersonFactory', newReservationPersonFactory, [])
  .factory('NewReservationProductFactory', newReservationProductFactory, ['moment', 'filterFilter'])
  .factory('NewReservationTimeFactory', newReservationTimeFactory, ['moment', 'filterFilter'])
  .factory('NewReservationTypeFactory', newReservationTypeFactory, ['$auth'])
  .factory('NewReservationZoneFactory', newReservationZoneFactory, ['$auth', 'filterFilter'])
  .name;
