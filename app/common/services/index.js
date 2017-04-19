import angular              from 'angular';
import UserService          from './user.service'
import ProductService       from './product.service'
import ZoneService          from './zone.service'
import TableService         from './table.service'
import ReservationService   from './reservation.service'
import JWTService           from './jwt.service'

export default angular.module('app.services', [])
  .service('User', UserService)
  .service('Product', ProductService)
  .service('Zone', ZoneService)
  .service('Table', TableService)
  .service('Reservation', ReservationService)
  .service('JWT', JWTService)
  .name;
