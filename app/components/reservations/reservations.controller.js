import angular from 'angular';

export default class ReservationsCtrl {
  constructor(User, Table, Reservation, ReservationPart, ReservationStatusMenu, ReservationStatus,
    PageFilterFactory, moment, filterFilter, $mdSidenav, $scope, $rootScope, $modal, $window,
    ReservationItemFactory, Product, Zone, $state) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Reservation = Reservation;
    this.ReservationPart = ReservationPart;
    this.ReservationStatus = ReservationStatus;
    this.Table = Table;
    this.Product = Product;
    this.Zone = Zone;

    this.$rootScope = $rootScope;
    this.moment = moment;
    this.filterFilter = filterFilter;
    this.$mdSidenav = $mdSidenav;
    this.$modal = $modal;

    this.tables = {};
    this.data = [];
    this.reservations = [];

    this.totalNumberOfReservations = 0;
    this.totalNumberOfPersons = 0;
    this.paramProduct = $state.params.productId;

    this.opened = false;
    this.$window = $window;

    $scope.$on('NewReservationCtrl.reload_reservations', () => {
      this.loadReservations();
    });

    $scope.$on('reservationStatusChanged', (e, data) => {
      this.changeReservatinItemStatus(data.reservation.id, data.status);
    });

    ReservationStatusMenu(this);
    ReservationItemFactory(this);
    PageFilterFactory(this);

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

      this.data.forEach((dataItem, index) => {
        if (dataItem.reservation.id === reservationId) {
          this.data[index] = this.rowPart(dataItem.part, reservation);
        }
      });
    }
  }

  openDatepicker() {
    this.opened = true;
  }

  openReservation() {
    const modalInstance = this.$modal.open({
      templateUrl: 'dashboard_reservations.new.view.html',
      controller: 'DashboardReservationsReservationCtrl as dash_reserv',
      size: 'md',
    });

    modalInstance.result.then(() => {
    }, () => {
    });
  }

  answer(reservation) {
    const modalInstance = this.$modal.open({
      templateUrl: 'reservation_answer.view.html',
      controller: 'ReservationAnswerCtrl as antwoord',
      size: 'md',
      resolve: {
        reservation: () => reservation,
      },
    });

    modalInstance.result.then(() => {
    }, () => {
    });
  }

  // remove this functional and use filters
  filterURIParams() {
    if (this.paramProduct) {
      const product = this.filterFilter(this.products, { id: this.paramProduct })[0];
      if (product) {
        this.filters = [{
          name: 'product',
          value: product.name,
        }];
      }
    }
  }

  setData() {
    const result = [];
    const reservations = this.applyFilterToReservations();
    reservations.forEach((reservation) => {
      reservation.reservation_parts.forEach((part) => {
        if (this.moment(part.date_time).format('YYYY-MM-DD') ===
            this.moment().format('YYYY-MM-DD')) {
          result.push(this.rowPart(part, reservation));
        }
      });
    });

    this.data = this.applySort(result);
    this.calculateTotalsForPrint();
  }

  calculateTotalsForPrint() {
    this.totalNumberOfReservations = this.reservations
      .filter(item => item.staus !== 'cancelled').length;

    this.totalNumberOfPersons = 0;
    this.data.forEach((item) => {
      this.totalNumberOfPersons += parseInt(item.number_of_persons, 10);
    });
  }

  changeSortPostProcess() {
    this.data = this.applySort(this.data);
  }

  loadReservations() {
    const date = this.moment().format('YYYY-MM-DD');
    this.Reservation
      .getAll(this.current_company_id, date).then((reservations) => {
        this.is_loaded = true;
        this.reservations = reservations;
        this.setData();
      });
  }

  loadProducts() {
    this.Product.getAll(this.current_company_id).then((products) => {
      this.products = products;
      this.products.forEach((product) => {
        this.filter_params.push({
          name: 'product',
          value: product.name,
        });
      });

      this.filterURIParams();
    });
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
    this.Table.getAll(this.current_company_id)
      .then((tables) => {
        this.tables = {};
        tables.forEach((table) => {
          this.tables[table.id] = table;
        });
        this.loadReservations();
      });
  }
}
