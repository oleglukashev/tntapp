import angular                    from 'angular';
import UserService                from './user.service'
import ProductService from './product.service';
import SettingsService from './settings.service';
import ZoneService from './zone.service';
import TableService from './table.service';
import ReservationService from './reservation.service';
import ReservationStatusService from './reservation_status.service';
import CustomerCompanyService from './customer_company.service';
import JWTService from './jwt.service';
import SearchService from './search.service';
import ChartsService from './charts.service';
import TimeRangeService from './time_range.service';
import PageFilterTimeRangeService from './page_filter_time_range.service';
import SliderService from './slider.service';
import CustomerService from './customer.service';
import ReservationPartService from './reservation_part.service';
import EmployeeService from './employee.service';
import CustomerNoteService from './customer_note.service';
import CustomerPreferenceService from './customer_preference.service';
import CustomerAllergiesService from './customer_allergies.service';
import newReservationService from '../../components/new_reservation/new_reservation.service';
import ConfirmService from './confirm.service';
import LoadedService from './loaded.service';

export default angular.module('app.services', [])
  .service('User', UserService)
  .service('Product', ProductService)
  .service('Settings', SettingsService)
  .service('Zone', ZoneService)
  .service('Table', TableService)
  .service('Reservation', ReservationService)
  .service('ReservationStatus', ReservationStatusService)
  .service('CustomerCompany', CustomerCompanyService)
  .service('JWT', JWTService)
  .service('Search', SearchService)
  .service('Charts', ChartsService)
  .service('TimeRange', TimeRangeService)
  .service('PageFilterTimeRange', PageFilterTimeRangeService)
  .service('Slider', SliderService)
  .service('Customer', CustomerService)
  .service('ReservationPart', ReservationPartService)
  .service('Employee', EmployeeService)
  .service('CustomerNote', CustomerNoteService)
  .service('CustomerPreference', CustomerPreferenceService)
  .service('CustomerAllergies', CustomerAllergiesService)
  .service('NewReservation', newReservationService)
  .service('Confirm', ConfirmService)
  .service('Loaded', LoadedService)
  .name;
