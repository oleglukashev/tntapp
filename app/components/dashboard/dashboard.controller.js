export default class DashboardCtrl {
  constructor(Reservation, moment) {
    'ngInject';

    this.moment = moment;
    Reservation
      .getAll()
        .then(
          (reservations) => {
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
