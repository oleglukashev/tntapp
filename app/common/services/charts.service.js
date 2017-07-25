export default class Charts {
  constructor(User, Reservation, AppConstants) {
    'ngInject';

    this.current_company = User.current_company;

    this.reservations = {};
    this.letterOfWeek = AppConstants.letterOfWeek;
    this.Reservation = Reservation;
  }

  get(reservations) {
    this.charts = {
      doughnut_keys: [],
      doughnut_values: [],
      doughnut_by_id: [],
      products: {},
      reservations: {},
      day_guests: {},
      day_guests_arr: [0],
      week_axis: [],
      total_guests_y: 0,
      total_guests_m: 0,
      total_guests_w: 0,
      total_guests_d: 0,
    };

    this.charts.total_guests_y = reservations.count_per_year;
    this.charts.total_guests_m = reservations.count_per_month;
    this.charts.total_guests_w = reservations.count_per_week;

    const mSecInDay = 1000 * 60 * 60 * 24;
    const countPerDays = {};

    if (!reservations.count_by_week) reservations.count_by_week = [];
    if (!reservations.today) reservations.today = [];

    reservations.count_by_week.forEach((n) => { countPerDays[n.pday] = n.cnt; });

    reservations.today.forEach((reservation) => {
      reservation.reservation_parts.forEach((part) => {
        const personsCount = parseInt(part.number_of_persons, 10);
        this.charts.reservations[part.product_id] =
          (this.charts.reservations[part.product_id] || 0) +
          personsCount;

        const date = new Date(part.date_time);
        const day = Math.floor(date.getTime() / mSecInDay);
        this.charts.day_guests[day] = (this.charts.day_guests[day] || 0) + personsCount;
        if (!this.charts.doughnut_by_id[part.product_id]) {
          this.charts.doughnut_by_id[part.product_id] = 0;
        }
        this.charts.doughnut_by_id[part.product_id] += personsCount;
        this.charts.total_guests_d += personsCount;
      });
    });
    const now = new Date();
    const today = Math.floor(now.getTime() / mSecInDay);

    let x = 0;
    for (let i = today - 6; i <= today; i += 1) {
      const day = new Date(i * mSecInDay);
      this.charts.day_guests_arr.push([x, countPerDays[day.getDate()] || 0]);
      this.charts.week_axis.push([x, this.letterOfWeek[day.getDay()]]);
      x += 1;
    }

    return this.getProducts();
  }

  getProducts() {
    this.Reservation
      .getProducts(this.current_company.id)
        .then(
          (products) => {
            products.forEach((product) => {
              this.charts.products[product.id] = product.name;
            });

            this.charts.doughnut_by_id.forEach((personCount, productId) => {
              this.charts.doughnut_keys.push(this.charts.products[productId]);
              this.charts.doughnut_values.push(personCount);
            });
          });

    return this.charts;
  }

}
