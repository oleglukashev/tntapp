import angular from 'angular';

export default class Controller {
  constructor(Table, User, Zone, ReservationItem, Customer, Product, ReservationPart,
    ReservationStatus, PageFilterFactory, filterFilter, moment,
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
    this.ReservationItem = ReservationItem;
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

    PageFilterFactory(this);

    this.setData();
    this.loadZonesAndTables();
    this.loadProducts();
  }

  changeStatus(reservation, status) {
    return this.ReservationStatus
      .changeStatus(this.current_company_id, reservation, status).then(() => {
        this.changeReservatinItemStatus(reservation.id, status);
      });
  }

  changeReservatinItemStatus(reservationId, status) {
    const reservation = this.filterFilter(this.reservations, { id: reservationId })[0];

    if (!reservation) return false;
    reservation.status = status;

    // replace dataItem in this.data by index
    Object.keys(this.data).forEach((date) => {
      // use reverse loop for correct removing items in circle
      for (let i = this.data[date].length - 1; i >= 0; i -= 1) {
        const dataItem = this.data[date][i];

        if (dataItem.reservation.id === reservationId) {
          this.data[date].splice(i, 1);

          if (dataItem.reservation.status !== 'cancelled' || this.cancelFilterIsOn()) {
            const newItem = this.ReservationItem.prepareData(dataItem.part, reservation, Object.values(this.zones));
            this.data[date].splice(i, 0, newItem);
          }
        }
      }
    });
  }

  setData() {
    this.data = {};
    this.dateTimes.forEach((dateTimeString) => {
      this.data[dateTimeString] =
        this.getDataByDateTime(dateTimeString);
    });
    this.calculateTotalsForPrint();
  }

  getDataLength() {
    let result = 0;

    Object.keys(this.data).forEach((date) => {
      result += this.data[date].length;
    });

    return result;
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
          const item = this.ReservationItem.prepareData(part, reservation, Object.values(this.zones));
          result.push(item);
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
          this.tables = {};
          zones.forEach((zone) => {
            this.zones[zone.id] = zone;
            zone.tables.forEach((table) => {
              if (!this.tables[table.id]) {
                this.tables[table.id] = table;
              }
            });
          });
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
