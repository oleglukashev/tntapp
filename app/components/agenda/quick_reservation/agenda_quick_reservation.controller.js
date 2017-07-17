export default class AgendaQuickReservationCtrl {
  constructor(User, Product, Reservation, table_id, datetime, filterFilter, moment, $window, $modalInstance) {
    'ngInject';

    this.current_company = User.current_company;
    this.datetime        = datetime;
    this.Product         = Product;
    this.Reservation     = Reservation;
    this.filterFilter    = filterFilter;
    this.$window         = $window;
    this.$modalInstance  = $modalInstance;
    this.moment          = moment;
    this.available_time  = {};
    this.reservation     = {
      datetime: this.moment(datetime).format('YYYY-MM-DD HH:mm:ss'),
      number_of_persons: 1,
      table_id: table_id,
    }

    this.loadProducts();
  }

  closeModal() {
    this.$modalInstance.dismiss('cancel');
  }

  availableProducts() {
    let date_string           = this.datetime.format('YYYY-MM-DD');
    let available_product_ids = [];

    Object.keys(this.available_time).forEach((product_id) => {
      let product  = this.filterFilter(this.products, { id: product_id })[0];
      let time_obj = this.filterFilter(this.available_time[product_id], { time: this.datetime.format('HH:mm') })[0];

      if (product && time_obj && ! this.timeIsDisabled(time_obj, product) && !available_product_ids[product_id]) {
        available_product_ids.push(product_id);
      }
    });

    return this.filterFilter(this.products, (item) => {
      return available_product_ids.includes(item.id)
    });
  }

  timeIsDisabled(time_obj, product, date) {
    let date = this.moment(this.reservation.datetime).format('YYYY-MM-DD');
    let obj_time = this.moment(date + ' ' + time_obj.time);
    let start_product_time = this.moment(date + ' ' + product.start_time);
    let end_product_time = this.moment(date + ' ' + product.end_time);

    if (this.reservation.number_of_persons > time_obj.max_personen_voor_tafels ||
        time_obj.is_closed ||
        time_obj.time_is_past
        ) {
      return true;
    }

    if ((obj_time <= end_product_time && obj_time >= start_product_time) &&
        (product.max_person_count &&
        product.max_person_count < this.reservation.number_of_persons) ||
        product.min_person_count > this.reservation.number_of_persons) {

      return true;
    }

    return false;
  }

  submitForm() {
    this.is_submitting = true;
    let name = this.reservation.name || '';

    let data = {
      last_name: name.split(' ').splice(1).join(' '),
      first_name: name.split(' ')[0],
      datetime: this.reservation.datetime,
      product_id: this.reservation.product_id,
      table_id: this.reservation.table_id,
      number_of_persons: this.reservation.number_of_persons
    }

    this.Reservation.createQuick(this.current_company.id, data)
      .then((result) => {
        this.is_submitting = false;
        this.success       = true;
        this.closeModal();
      },
      (error) => {
        this.is_submitting = false;
        this.errors = error;
      });
  }

  loadProducts() {
    this.products = [];

    this.Product
      .getAll(this.current_company.id)
        .then(
          (result) => {
            this.products = result;
            this.loadAvailableTablesOfProducts();
          },
          (error) => {
          });
  }

  loadAvailableTablesOfProducts() {
    this.Product
      .getAvailableTablesOfProducts(this.current_company.id, this.datetime.format('YYYY-MM-DD'))
        .then(
          (result) => {
            this.available_time = result;
          },
          (error) => {
          });
  }
}
