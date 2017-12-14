export default class Charts {
  constructor(User, Product, AppConstants) {
    'ngInject';

    this.current_company = User.current_company;

    this.letterOfWeek = AppConstants.letterOfWeek;
    this.Product = Product;
  }

  get(reservations) {
    this.charts = {
      guests_by_product: { 0: 0 },
      products: {},
      reservations: {},
      day_guests: {},
      day_guests_arr: [0],
      week_axis: [],
      total_guests_y: 0,
      total_guests_m: 0,
      total_guests_w: 0,
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
      if (reservation.reservation.status !== 'cancelled') {
        reservation.reservation.reservation_parts.forEach((part) => {
          const personsCount = parseInt(part.number_of_persons, 10);
          this.charts.reservations[part.product_id] =
            (this.charts.reservations[part.product_id] || 0) +
            personsCount;

          const date = new Date(part.date_time);
          const day = Math.floor(date.getTime() / mSecInDay);
          this.charts.day_guests[day] = (this.charts.day_guests[day] || 0) + personsCount;
          if (part.product_id) {
            if (!this.charts.guests_by_product[part.product_id]) {
              this.charts.guests_by_product[part.product_id] = 0;
            }
            this.charts.guests_by_product[part.product_id] += personsCount;
          }
          this.charts.guests_by_product[0] += personsCount;
        });
      }
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

  getPercent(totalGuests, guestsCount) {
    if (!totalGuests) {
      return 0;
    }

    return 100 - ((guestsCount / totalGuests) * 100);
  }

  getProducts() {
    this.Product
      .getAll(this.current_company.id, true)
      .then((products) => {
        products.forEach((product) => {
          if (product.id) {
            this.charts.products[product.id] = product.name;
          }
        });
        this.charts.products[0] = 'Totaal';
      });

    return this.charts;
  }
}
