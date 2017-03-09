export default class DashboardCtrl {
  constructor($scope, Reservation, moment, $ocLazyLoad, $timeout) {

    this.moment = moment;
    Reservation
      .getAll()
        .then(
          (reservations) => {
            $ocLazyLoad.load('assets/jquery.easypiechart.fill.js')
            this.reservationsLoaded = true;
            this.request_reservations = reservations.filter((item) => item.status === 'Aanvraag');
            this.group_reservations = reservations.filter((item) => item.is_group === true);
            this.today_reservation = reservations
                                       .filter((res) => {
                                         return res.reservation_parts.filter((res_part) => {
                                           return this.moment(res_part.datetime).format('MMM DD YY') == this.moment().format('MMM DD YY')
                                         })
                                       })
          }
        );
  }

  parsedDate(date) {
    return this.moment(date).format('h:mm');
  }
}

DashboardCtrl.$inject = ['$scope', 'Reservation', 'moment', '$ocLazyLoad', '$timeout'];
