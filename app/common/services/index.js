import angular              from 'angular';
import UserService          from './user.service'
import ReservationService   from './reservation.service'
import JWTService           from './jwt.service'

export default angular.module('app.services', [])
  .service('User', UserService)
  .service('Reservation', ReservationService)
  .service('JWT', JWTService)
  .name;
