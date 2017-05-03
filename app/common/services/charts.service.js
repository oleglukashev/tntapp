import angular from 'angular';

export default class Charts {
  constructor(User, Reservation) {
    'ngInject';

    this.current_company = User.current_company;

    this.reservations = {};
    this.charts       = {
      doughnut_keys:  [],
      doughnut_values:[],
      doughnut_by_id: [],
      products:       {},
      reservations:   {},
      day_guests:     {},
      day_guests_arr: [0],
      week_axis:      [],
      total_guests_y: 0,
      total_guests_m: 0,
      total_guests_w: 0,
      total_guests_d: 0,
    };
    this.days_of_week = ['Z','M','D','W','D','V','Z','Z','M','D','W','D','V','Z'];
    this.Reservation = Reservation;
  }

  get(reservations) {
    this.charts.total_guests_y = reservations['count_per_year'];
    this.charts.total_guests_m = reservations['count_per_month'];
    this.charts.total_guests_w = reservations['count_per_week'];

    let count_per_days = {};

    if (!reservations['count_by_week']) reservations['count_by_week'] = [];
    if (!reservations.today) reservations.today = [];

    reservations['count_by_week'].map((n) => { count_per_days[n['pday']] = n['cnt'] })

    reservations.today.map((reservation) => {
      reservation['reservation_parts'].map((part) => {
        this.charts.reservations[part['product_id']] =
          (this.charts.reservations[part['product_id']] || 0) +
          part['person_count'];

        let date = new Date(part['datetime']);
        let day  = Math.floor(date.getTime()/(1000*60*60*24))
        this.charts.day_guests[day] = (this.charts.day_guests[day] || 0) + part['person_count'];
        if (!this.charts.doughnut_by_id[part['product_id']]) this.charts.doughnut_by_id[part['product_id']]=0;
        this.charts.doughnut_by_id[part['product_id']] += part['person_count'];
        this.charts.total_guests_d += part['person_count'];
      })
    })
    let now  = new Date();
    let today = Math.floor(now.getTime()/(1000*60*60*24));

    let x=0;
    for (let i=today-6;i<=today;i++) {
      let day = new Date(i*1000*60*60*24);
      this.charts.day_guests_arr.push( [x, count_per_days[day.getDate()] || 0] );
      this.charts.week_axis.push( [x, this.days_of_week[day.getDay()]] );
      x++;
    }

    return this.getProducts();
  }

  getProducts() {
    this.Reservation
      .getProducts(this.current_company.id)
        .then(
          (products) => {
            products.map((product) => {
              this.charts.products[product['id']] = product['name'];
            });

            this.charts.doughnut_by_id.map((person_count, product_id) => {
              this.charts.doughnut_keys.push(this.charts.products[product_id]);
              this.charts.doughnut_values.push(person_count);
            });
          });

    return this.charts;
  }

}
