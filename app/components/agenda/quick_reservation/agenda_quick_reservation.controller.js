export default class AgendaQuickReservationCtrl {
  constructor(User, Product, Reservation, tableId, tableNumber, datetime, filterFilter,
    moment, $window, $modalInstance) {
    'ngInject';

    this.current_company = User.current_company;
    this.datetime = datetime;
    this.Product = Product;
    this.Reservation = Reservation;
    this.filterFilter = filterFilter;
    this.$window = $window;
    this.$modalInstance = $modalInstance;
    this.moment = moment;
    this.available_time = {};
    this.reservation = {
      datetime: this.moment(datetime).format('YYYY-MM-DD HH:mm:ss'),
      number_of_persons: 1,
      table_number: tableNumber,
      table_id: tableId,
    };

    this.loadProducts();
  }

  closeModal() {
    this.$modalInstance.dismiss('cancel');
  }

  availableProducts() {
    const availableProductIds = [];

    Object.keys(this.available_time).forEach((productId) => {
      const product = this.filterFilter(this.products, { id: productId })[0];
      const timeObj = this.filterFilter(this.available_time[productId], { time: this.datetime.format('HH:mm') })[0];

      if (product && timeObj && !this.timeIsDisabled(timeObj, product) &&
        !availableProductIds[productId]) {
        availableProductIds.push(productId);
      }
    });

    return this.filterFilter(this.products, item => availableProductIds.includes(item.id));
  }

  timeIsDisabled(timeObj, product) {
    const dateString = this.moment(this.reservation.datetime).format('YYYY-MM-DD');
    const time = this.moment(`${dateString} ${timeObj.time}`);
    const startProductTime = this.moment(`${dateString} ${product.start_time}`);
    const endProductTime = this.moment(`${dateString} ${product.end_time}`);

    if (this.reservation.number_of_persons > timeObj.max_personen_voor_tafels ||
        timeObj.is_closed ||
        timeObj.time_is_past) {
      return true;
    }

    if ((time <= endProductTime &&
        time >= startProductTime &&
        product.max_person_count &&
        product.max_person_count < this.reservation.number_of_persons) ||
        product.min_person_count > this.reservation.number_of_persons) {
      return true;
    }

    return false;
  }

  submitForm() {
    this.is_submitting = true;
    const name = this.reservation.name || '';
    const data = {
      last_name: name.split(' ').splice(1).join(' '),
      first_name: name.split(' ')[0],
      datetime: this.reservation.datetime,
      product_id: this.reservation.product_id,
      table_id: this.reservation.table_id,
      number_of_persons: this.reservation.number_of_persons,
    };

    this.Reservation.createQuick(this.current_company.id, data)
      .then(() => {
        this.is_submitting = false;
        this.success = true;
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
      .getAll(this.current_company.id).then(
        (result) => {
          this.products = result;
          this.loadAvailableTablesOfProducts();
        },
        () => {
        });
  }

  loadAvailableTablesOfProducts() {
    this.Product
      .getAvailableTablesOfProducts(this.current_company.id, this.datetime.format('YYYY-MM-DD')).then(
        (result) => {
          this.available_time = result;
        },
        () => {
        });
  }
}
