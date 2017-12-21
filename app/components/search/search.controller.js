class SearchCtrl {
  constructor(Table, User, Zone, ReservationItemFactory, Customer, Product, ReservationPart,
    ReservationStatus, PageFilterFactory, ReservationStatusMenu, filterFilter, moment,
    $state, $rootScope, $stateParams, $scope) {
    'ngInject';

    this.current_company_id = User.getCompanyId();

    this.Table = Table;
    this.Zone = Zone;
    this.Product = Product;
    this.moment = moment;
    this.filterFilter = filterFilter;
    this.$rootScope = $rootScope;
    this.$stateParams = $stateParams;
    this.Customer = Customer;
    this.ReservationPart = ReservationPart;
    this.ReservationStatus = ReservationStatus;
    this.tables = {};
    this.zones = {};
    this.products = [];
    this.data = {};
    this.dateTimes = [];

    this.reservations = this.$stateParams.reservations || [];

    this.dateTimes = this
      .ReservationPart
      .partsByReservations(this.reservations)
      .map(part => this.moment(part.date_time).format('YYYY-MM-DD'))
      .filter((v, i, a) => a.indexOf(v) === i);

    $scope.$on('reservationStatusChanged', (e, data) => {
      this.changeReservatinItemStatus(data.reservation.id, data.status);
    });

    ReservationItemFactory(this);
    ReservationStatusMenu(this);
    PageFilterFactory(this);

    this.setData();
    this.loadZonesAndTables();
    this.loadProducts();
  }

  changeStatus(reservation, status) {
    this.ReservationStatus
      .changeStatus(this.current_company_id, reservation, status).then(() => {
        this.changeReservatinItemStatus(reservation.id, status);
      });
  }

  changeReservatinItemStatus(reservationId, status) {
    const reservation = this.filterFilter(this.reservations, { id: reservationId })[0];

    if (reservation) {
      reservation.status = status;

      Object.keys(this.data).forEach((date) => {
        this.data[date].forEach((dataItem, index) => {
          if (dataItem.reservation.id === reservationId) {
            this.data[date][index] = this.rowPart(dataItem.part, reservation);
          }
        });
      });
    }
  }

  setData() {
    this.data = {};
    this.dateTimes.forEach((dateTimeString) => {
      this.data[dateTimeString] =
        this.getDataByDateTime(dateTimeString);
    });
    this.calculateTotalsForPrint();
  }

  calculateTotalsForPrint() {
    this.totalNumberOfReservations = this.reservations
      .filter(item => item.staus !== 'cancelled').length;

    this.totalNumberOfPersons = 0;
    Object.keys(this.data).forEach((dateTimeString) => {
      this.data[dateTimeString].forEach((dateItem) => {
        this.totalNumberOfPersons += parseInt(dateItem.number_of_persons, 10);
      });
    });
  }

  changeSortPostProcess() {
    this.dateTimes.forEach((dateTimeString) => {
      this.data[dateTimeString] = this.applySort(this.data[dateTimeString]);
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

  loadZonesAndTables() {
    this.Zone.getAll(this.current_company_id)
      .then(
        (zones) => {
          this.zones = {};
          zones.forEach((zone) => {
            this.zones[zone.id] = zone;
          });
          this.loadTables();
        }, () => {});
  }

  loadTables() {
    this.tables = {};

    this.Table.getAll(this.current_company_id).then(
      (tables) => {
        tables.forEach((table) => {
          this.tables[table.id] = table;
        });

        this.setData();
      }, () => {});
  }

  loadProducts() {
    this.Product.getAll(this.current_company_id).then(
      (products) => {
        this.products = products;
        this.products.forEach((product) => {
          const productFilterParams = {
            name: 'product',
            value: product.name,
          };

          this.product_filter_params.push(productFilterParams);
          this.product_filter.push(productFilterParams);
        });
      });
  }
}

export default SearchCtrl;
