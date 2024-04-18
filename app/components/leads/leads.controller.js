export default class Controller {
  constructor(User, Zone, Reservation, ReservationItem, ReservationStatus, Product, TimeRange, filterFilter, PageFilterFactory, moment, $rootScope, $uibModal, $q) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Zone = Zone;
    this.Reservation = Reservation;
    this.Product = Product;
    this.ReservationItem = ReservationItem;
    this.ReservationStatus = ReservationStatus;
    this.TimeRange = TimeRange;
    this.filterFilter = filterFilter;
    this.moment = moment;
    this.$rootScope = $rootScope;
    this.$modal = $uibModal;
    this.userIsManager = User.isManager.bind(User);
    this.date_range_filter = {
      selectedTemplate: 'TM',
    }
    this.source = 'leads';

    PageFilterFactory(this);

    this.is_loaded = false;
    this.time_ranges_is_loaded = false;

    if (this.userIsManager()) {
      $q.all([
        this.Zone.getAll(this.current_company_id)
      ]).then((result) => {
        this.initZones(result[0]);
      })
    } else {
      // no access
      window.location.href = '/';
    }
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
    // use reverse loop for correct removing items in circle
    for (let i = this.data.length - 1; i >= 0; i -= 1) {
      const dataItem = this.data[i];
      if (dataItem.reservation.id === reservationId) {
        this.data.splice(i, 1);

        if (dataItem.reservation.status !== 'cancelled' || this.cancelFilterIsOn()) {
          const newItem = this.ReservationItem.prepareData(dataItem.part, reservation, Object.values(this.zones));
          this.data.splice(i, 0, newItem);
        }
      }
    }

    return false;
  }

  openReservation() {
    const modalInstance = this.$modal.open({
      component: 'newLeadsReservation',
      size: 'md',
      backdrop: 'static',
      resolve: {
        load: ['$ocLazyLoad', ($ocLazyLoad) => {
          return import(/* webpackChunkName: "new.leads.reservation.module" */ "../new.leads.reservation")
            .then(mod => $ocLazyLoad.load({
              name: "newLeadsReservation"
            }))
            .catch(err => {
              throw new Error("Ooops, something went wrong, " + err);
            });
        }],
      },
    });

    modalInstance.result.then(() => {
      this.loadReservations();
    }, () => {
      this.loadReservations();
    });
  }

  getTableIdsByTablesList(list) {
    return list.map(item => item.id);
  }


  setData() {
    this.data = [];
    this.graph_data = {};
    this.data_without_tables = [];
    const reservations = this.applyFilterToReservations();

    let dataResult = [];
    reservations.forEach((reservation) => {
      reservation.reservation_parts.forEach((part) => {
        const part_date = this.moment(part.date_time).format('YYYY-MM-DD');
        const filter_date_start = this.moment(this.date_range_filter.dateStart).format('YYYY-MM-DD');
        const filter_date_end = this.moment(this.date_range_filter.dateEnd).format('YYYY-MM-DD');
        if (part_date >= filter_date_start && part_date <= filter_date_end) {
          dataResult.push(this.ReservationItem.prepareData(part, reservation, Object.values(this.zones)));
        }
      });
    });

    this.data = this.applySort(dataResult);
    this.$rootScope.$broadcast('agenda.load_reservations_data_and_date_filter',
      { reservations_data: this.data, date: this.date_filter });
  }

  changeSortPostProcess() {
    this.data = this.applySort(this.data);
  }

  loadReservations() {
    this.reservations = [];
    const dateRange = [
      this.moment(this.date_range_filter.dateStart).format('YYYY-MM-DD'),
      this.moment(this.date_range_filter.dateEnd).format('YYYY-MM-DD'),
    ];
    this.Reservation.getAllLeads(this.current_company_id, dateRange)
      .then((result) => {
        this.is_loaded = true;
        this.$rootScope.show_spinner = false;
        this.reservations = result;
        this.setData();
      });
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

  loadTimeRanges() {
  }

  initZones(zones) {
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

    this.loadReservations();
    this.loadProducts();
    //this.loadTimeRanges();
  }
}
