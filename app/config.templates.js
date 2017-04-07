export default function templates($templateCache) {
  'ngInject';

  $templateCache.removeAll();
  $templateCache.put('header.view.html', require('./shared/header/header.view.html'));
  $templateCache.put('footer.view.html', require('./shared/footer/footer.view.html'));
  $templateCache.put('app.html', require('./components/layout/app.html'));
  $templateCache.put('login.html', require('./components/layout/login.html'));
  $templateCache.put('user_menu.view.html', require('./shared/user_menu/user_menu.view.html'));
  $templateCache.put('dashboard.reservation.view.html', require('./components/dashboard/dashboard.reservation.view.html'));

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
}
