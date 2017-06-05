import angular              from 'angular';
import UserService          from './user.service'
import ProductService       from './product.service'
import SettingsService      from './settings.service'
import ZoneService          from './zone.service'
import TableService         from './table.service'
import ReservationService   from './reservation.service'
import JWTService           from './jwt.service'
import SearchService        from './search.service'
import ChartsService        from './charts.service'
import TimeRangeService     from './time_range.service'

export default angular.module('app.services', [])
  .service('User', UserService)
  .service('Product', ProductService)
  .service('Settings', SettingsService)
  .service('Zone', ZoneService)
  .service('Table', TableService)
  .service('Reservation', ReservationService)
  .service('JWT', JWTService)
  .service('Search', SearchService)
  .service('Charts', ChartsService)
  .service('TimeRange', TimeRangeService)
  .name;
