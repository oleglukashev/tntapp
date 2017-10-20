class SearchCtrl {
  constructor(Table, User, AgendaItemFactory, Customer, Product, ReservationPart,
    PageFilterFactory, ReservationStatusMenu, moment, $state, $rootScope, $stateParams) {
    'ngInject';

    this.current_company_id = User.getCompanyId();

    this.Table = Table;
    this.Product = Product;
    this.moment = moment;
    this.$rootScope = $rootScope;
    this.$stateParams = $stateParams;
    this.Customer = Customer;
    this.ReservationPart = ReservationPart;
    this.tables = [];
    this.products = [];
    this.data = {};
    this.dateTimes = [];

    this.reservations = this.$stateParams.reservations || [];

    this.dateTimes = this
      .ReservationPart
      .partsByReservations(this.reservations)
      .map(part => this.moment(part.date_time).format('YYYY-MM-DD'))
      .filter((v, i, a) => a.indexOf(v) === i);

    AgendaItemFactory(this);
    ReservationStatusMenu(this);
    PageFilterFactory(this);
    this.setData();
    this.loadTables();
    this.loadProducts();
  }

  loadTables() {
    this.tables = [];

    this.Table.getAll(this.current_company_id).then(
      (result) => {
        this.tables = result;
      }, () => {});
  }

  loadProducts() {
    this.Product.getAll(this.current_company_id).then(
      (products) => {
        this.products = products;
        this.products.forEach((product) => {
          this.filter_params.push({
            name: 'product',
            value: product.name,
          });
        });
      });
  }

  setData() {
    this.data = {};
    this.dateTimes.forEach((dateTimeString) => {
      this.data[dateTimeString] =
        this.getDataByDateTime(dateTimeString);
    });
  }

  getDataByDateTime(dateTimeString) {
    const result = [];
    const reservations = this.applyFilterToReservations();

    reservations.forEach((reservation) => {
      reservation.reservation_parts.forEach((part) => {
        if (this.moment(part.date_time).format('YYYY-MM-DD') === dateTimeString) {
          result.push(this.rowPart(part, reservation));
        }
      });
    });

    return this.applySort(result);
  }
}

export default SearchCtrl;
