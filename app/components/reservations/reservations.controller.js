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
    this.$rootScope.show_spinner = true;
  }

  changeStatus(reservation, status) {
    this.ReservationStatus
      .changeStatus(this.current_company_id, reservation, status).then(() => {
        this.changeReservatinItemStatus(reservation.id, status);
      });
  }

  changeReservatinItemStatus(reservationId, status) {
    const reservation = this.filterFilter(this.reservations, { id: reservationId })[0];

    if (!reservation) return false;
    reservation.status = status;

    // replace dataItem in this.data by index
    // use reverse loop for correct removing items in circle
    for (let i = this.data.length - 1; i >= 0; i -= 1) {
      const dataItem = this.data[i];

      if (dataItem.reservation.id === reservationId) {
        this.data.splice(i, 1);

        if (dataItem.reservation.status !== 'cancelled' || this.cancelFilterIsOn()) {
          this.data.splice(i, 0, this.rowPart(dataItem.part, reservation));
        }
      }
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

  filterURIParams() {
    if (this.paramProduct) {
      const product = this.filterFilter(this.products, { id: this.paramProduct })[0];
      if (product) {
        this.filter_type = 'product';
        this.product_filter = [{
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
        this.$rootScope.show_spinner = false;
        this.reservations = reservations;
        this.setData();
      }, () => {
        this.$rootScope.show_spinner = false;
      });
  }

  loadProducts() {
    this.Product.getAll(this.current_company_id).then((products) => {
      this.products = products;
      this.products.forEach((product) => {
        const productFilterParams = {
          name: 'product',
          value: product.name,
        };

        this.product_filter_params.push(productFilterParams);
        this.product_filter.push(productFilterParams);
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
