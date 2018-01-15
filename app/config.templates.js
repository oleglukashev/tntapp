export default function templates($templateCache) {
  'ngInject';

  $templateCache.removeAll();
  $templateCache.put('header.view.html', require('./shared/header/header.view.html'));
  $templateCache.put('footer.view.html', require('./shared/footer/footer.view.html'));
  $templateCache.put('app.html', require('./components/layout/app.html'));
  $templateCache.put('login.html', require('./components/layout/login.html'));
  $templateCache.put('user_menu.view.html', require('./shared/user_menu/user_menu.view.html'));
  $templateCache.put('mobile_menu.view.html', require('./shared/mobile_menu/mobile_menu.view.html'));
  $templateCache.put('page_filter_time_ranges.view.html', require('./shared/page_filter/time_ranges/page_filter_time_ranges.view.html'));
  $templateCache.put('search.view.html', require('./components/search/search.view.html'));
  $templateCache.put('charts.view.html', require('./components/dashboard/charts/charts.view.html'));
  $templateCache.put('settings_products.new_product.view.html', require('./components/settings/products/settings_products.new_product.view.html'));
  $templateCache.put('settings_mails.edit_mail.view.html', require('./components/settings/mails/settings_mails.edit_mail.view.html'));
  $templateCache.put('settings_warnings.edit.view.html', require('./components/settings/warnings/edit/settings_warnings.edit.view.html'));
  $templateCache.put('settings_tables.new_zone.view.html', require('./components/settings/tables/settings_tables.new_zone.view.html'));
  $templateCache.put('dashboard_reservations.view.html', require('./components/dashboard/reservations/dashboard_reservations.view.html'));
  $templateCache.put('dashboard_reservations.item.view.html', require('./components/dashboard/reservations/dashboard_reservations.item.view.html'));
  $templateCache.put('dashboard_reservations.new.view.html', require('./components/dashboard/reservations/dashboard_reservations.new.view.html'));
  $templateCache.put('reservation_part.edit.view.html', require('./components/reservation_parts/reservation_part.edit.view.html'));
  $templateCache.put('rzSliderTpl.html', require('./shared/rz-slider/rz-slider.view.html'));
  $templateCache.put('reservation_answer.view.html', require('./components/reservation_answer/reservation_answer.view.html'));
  $templateCache.put('reservation_print.view.html', require('./shared/reservation_print/reservation_print.view.html'));
  $templateCache.put('search.print.view.html', require('./components/search/search.print.view.html'));
  $templateCache.put('agenda.view.html', require('./components/agenda/agenda.view.html'));
  $templateCache.put('agenda_charts.view.html', require('./components/agenda/charts/agenda_charts.view.html'));
  $templateCache.put('user_menu.edit.view.html', require('./shared/user_menu/edit/user_menu.edit.view.html'));
  $templateCache.put('settings_employees.item.view.html', require('./components/settings/employees/settings_employees.item.view.html'));
  $templateCache.put('agenda_quick_reservation.view.html', require('./components/agenda/quick_reservation/agenda_quick_reservation.view.html'));
  $templateCache.put('agenda.widget.html', require('./components/agenda/agenda.widget.html'));
  $templateCache.put('new_reservation.date.view.html', require('./components/new_reservation/new_reservation.date.view.html'));
  $templateCache.put('new_reservation.number_of_persons.view.html', require('./components/new_reservation/new_reservation.number_of_persons.view.html'));
  $templateCache.put('new_reservation.product.view.html', require('./components/new_reservation/new_reservation.product.view.html'));
  $templateCache.put('new_reservation.time.view.html', require('./components/new_reservation/new_reservation.time.view.html'));
  $templateCache.put('new_reservation.zone.view.html', require('./components/new_reservation/new_reservation.zone.view.html'));
  $templateCache.put('new_reservation.person.view.html', require('./components/new_reservation/new_reservation.person.view.html'));
  $templateCache.put('new_reservation.person.autocomplete.view.html', require('./components/new_reservation/new_reservation.person.autocomplete.view.html'));
  $templateCache.put('new_reservation.type.view.html', require('./components/new_reservation/new_reservation.type.view.html'));
  $templateCache.put('new_reservation.group.view.html', require('./components/new_reservation/new_reservation.group.view.html'));
  $templateCache.put('new_reservation.walk_in.view.html', require('./components/new_reservation/new_reservation.walk_in.view.html'));
  $templateCache.put('agenda.item.view.html', require('./components/agenda/agenda.item.view.html'));
  $templateCache.put('reservation_status_menu.view.html', require('./shared/reservation_status_menu/reservation_status_menu.view.html'));

  $templateCache.put('page_filter.date.view.html', require('./shared/page_filter/page_filter.date.view.html'));
  $templateCache.put('page_filter.print.view.html', require('./shared/page_filter/page_filter.print.view.html'));
  $templateCache.put('page_filter.change_view.view.html', require('./shared/page_filter/page_filter.change_view.view.html'));
  $templateCache.put('page_filter.settings.view.html', require('./shared/page_filter/page_filter.settings.view.html'));
  $templateCache.put('page_filter.profile_settings.view.html', require('./shared/page_filter/page_filter.profile_settings.view.html'));
  $templateCache.put('page_filter.search_settings.view.html', require('./shared/page_filter/page_filter.search_settings.view.html'));
  $templateCache.put('page_filter.filter.view.html', require('./shared/page_filter/page_filter.filter.view.html'));
  $templateCache.put('page_filter.sort.view.html', require('./shared/page_filter/page_filter.sort.view.html'));

  $templateCache.put('reservation_part.reservation.view.html', require('./components/reservation_parts/reservation_part.reservation.view.html'));
  $templateCache.put('user_menu.main_info.view.html', require('./shared/user_menu/edit/user_menu.main_info.view.html'));
  $templateCache.put('user_menu.comments.view.html', require('./shared/user_menu/edit/user_menu.comments.view.html'));
  $templateCache.put('user_menu.preferences.view.html', require('./shared/user_menu/edit/user_menu.preferences.view.html'));
  $templateCache.put('user_menu.allergies.view.html', require('./shared/user_menu/edit/user_menu.allergies.view.html'));

  //angular-bootstrap tpls
  $templateCache.put("template/modal/backdrop.html",
    "<div class=\"modal-backdrop fade {{ backdropClass }}\"\n" +
    "     ng-class=\"{in: animate}\"\n" +
    "     ng-style=\"{'z-index': 1040 + (index && 1 || 0) + index*10}\"\n" +
    "></div>\n" +
    "");
  $templateCache.put("template/modal/window.html",
    "<div tabindex=\"-1\" role=\"dialog\" class=\"modal fade\" ng-class=\"{in: animate}\" ng-style=\"{'z-index': 1050 + index*10, display: 'block'}\" ng-click=\"close($event)\">\n" +
    "    <div class=\"modal-dialog\" ng-class=\"{'modal-sm': size == 'sm', 'modal-lg': size == 'lg'}\"><div class=\"modal-content\" modal-transclude></div></div>\n" +
    "</div>");
  $templateCache.put("template/datepicker/datepicker.html",
    "<div ng-switch=\"datepickerMode\" role=\"application\" ng-keydown=\"keydown($event)\">\n" +
    "  <daypicker ng-switch-when=\"day\" tabindex=\"0\"></daypicker>\n" +
    "  <monthpicker ng-switch-when=\"month\" tabindex=\"0\"></monthpicker>\n" +
    "  <yearpicker ng-switch-when=\"year\" tabindex=\"0\"></yearpicker>\n" +
    "</div>");
  $templateCache.put("template/datepicker/day.html",
    "<table role=\"grid\" aria-labelledby=\"{{uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
    "  <thead>\n" +
    "    <tr>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-left\"></i></button></th>\n" +
    "      <th colspan=\"{{5 + showWeeks}}\"><button id=\"{{uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"toggleMode()\" tabindex=\"-1\" style=\"width:100%;\"><strong>{{title}}</strong></button></th>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-right\"></i></button></th>\n" +
    "    </tr>\n" +
    "    <tr>\n" +
    "      <th ng-show=\"showWeeks\" class=\"text-center\"></th>\n" +
    "      <th ng-repeat=\"label in labels track by $index\" class=\"text-center\"><small aria-label=\"{{label.full}}\">{{label.abbr}}</small></th>\n" +
    "    </tr>\n" +
    "  </thead>\n" +
    "  <tbody>\n" +
    "    <tr ng-repeat=\"row in rows track by $index\">\n" +
    "      <td ng-show=\"showWeeks\" class=\"text-center h6\"><em>{{ weekNumbers[$index] }}</em></td>\n" +
    "      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{dt.uid}}\" aria-disabled=\"{{!!dt.disabled}}\">\n" +
    "        <button type=\"button\" style=\"width:100%;\" class=\"btn btn-default btn-sm\" ng-class=\"{'btn-success': dt.selected, active: isActive(dt)}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\"><span ng-class=\"{'text-muted': dt.secondary}\">{{dt.label}}</span></button>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>\n" +
    "");
  $templateCache.put("template/datepicker/month.html",
    "<table role=\"grid\" aria-labelledby=\"{{uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
    "  <thead>\n" +
    "    <tr>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-left\"></i></button></th>\n" +
    "      <th><button id=\"{{uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"toggleMode()\" tabindex=\"-1\" style=\"width:100%;\"><strong>{{title}}</strong></button></th>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-right\"></i></button></th>\n" +
    "    </tr>\n" +
    "  </thead>\n" +
    "  <tbody>\n" +
    "    <tr ng-repeat=\"row in rows track by $index\">\n" +
    "      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{dt.uid}}\" aria-disabled=\"{{!!dt.disabled}}\">\n" +
    "        <button type=\"button\" style=\"width:100%;\" class=\"btn btn-default\" ng-class=\"{'btn-success': dt.selected, active: isActive(dt)}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\"><span>{{dt.label}}</span></button>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>\n" +
    "");
  $templateCache.put("template/datepicker/year.html",
    "<table role=\"grid\" aria-labelledby=\"{{uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
    "  <thead>\n" +
    "    <tr>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-left\"></i></button></th>\n" +
    "      <th colspan=\"3\"><button id=\"{{uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"toggleMode()\" tabindex=\"-1\" style=\"width:100%;\"><strong>{{title}}</strong></button></th>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-right\"></i></button></th>\n" +
    "    </tr>\n" +
    "  </thead>\n" +
    "  <tbody>\n" +
    "    <tr ng-repeat=\"row in rows track by $index\">\n" +
    "      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{dt.uid}}\" aria-disabled=\"{{!!dt.disabled}}\">\n" +
    "        <button type=\"button\" style=\"width:100%;\" class=\"btn btn-default\" ng-class=\"{'btn-success': dt.selected, active: isActive(dt)}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\"><span>{{dt.label}}</span></button>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>\n" +
    "");
  $templateCache.put("template/datepicker/popup.html",
    "<ul class=\"dropdown-menu\" ng-style=\"{display: (isOpen && 'block') || 'none', top: position.top+'px', left: position.left+'px'}\" ng-keydown=\"keydown($event)\">\n" +
    "	<li ng-transclude></li>\n" +
    "	<li ng-if=\"showButtonBar\" style=\"padding:10px 9px 2px\">\n" +
    "		<span class=\"btn-group pull-left\">\n" +
    "			<button type=\"button\" class=\"btn btn-sm btn-success\" ng-click=\"select('today')\">{{ getText('current') }}</button>\n" +
    "			<button type=\"button\" class=\"btn btn-sm btn-danger\" ng-click=\"select(null)\">{{ getText('clear') }}</button>\n" +
    "		</span>\n" +
    "		<button type=\"button\" class=\"btn btn-sm btn-success pull-right\" ng-click=\"close()\">{{ getText('close') }}</button>\n" +
    "	</li>\n" +
    "</ul>\n" +
    "");

  $templateCache.put("template/accordion/accordion-group.html",
    "<div class=\"panel\">\n" +
    "  <div class=\"panel-heading\">\n" +
    "    <a href class=\"accordion-toggle\" ng-click=\"toggleOpen()\" accordion-transclude=\"heading\"><span ng-class=\"{'text-muted': isDisabled}\">{{heading}}</span></a>\n" +
    "  </div>\n" +
    "  <div class=\"panel-collapse\" collapse=\"!isOpen\">\n" +
    "     <div class=\"panel-body\" ng-transclude></div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");

  $templateCache.put("template/accordion/accordion.html",
    "<div class=\"panel-group\" ng-transclude></div>");
}
