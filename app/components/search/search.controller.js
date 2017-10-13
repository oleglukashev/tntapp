class SearchCtrl {
  constructor(Table, User, AgendaItemFactory, Customer, ReservationPart, ReservationStatus,
    ReservationStatusMenu, moment, $state, $rootScope, $stateParams) {
    'ngInject';

    this.current_company_id = User.getCompanyId();

    this.Table = Table;
    this.moment = moment;
    this.$rootScope = $rootScope;
    this.$stateParams = $stateParams;
    this.Customer = Customer;
    this.ReservationPart = ReservationPart;
    this.ReservationStatus = ReservationStatus;
    this.tables = [];
    this.tableOptions = {};
    this.dateTimes = [];

    this.reservations = this.$stateParams.reservations || [];

    this.dateTimes = this
      .ReservationPart
      .partsByReservations(this.reservations)
      .map(part => this.moment(part.date_time).format('YYYY-MM-DD'))
      .filter((v, i, a) => a.indexOf(v) === i);

    this.dateTimes.forEach((dateTime) => {
      this.tableOptions[dateTime] = { data: [] };
    });

    AgendaItemFactory(this);
    ReservationStatusMenu(this);
    this.setTableOptions();
    this.loadTables();
  }

  loadTables() {
    this.tables = [];

    this.Table.getAll(this.current_company_id).then(
      (result) => {
        this.tables = result;
      }, () => {});
  }

  getTableOptions(dateTimeString) {
    return this.tableOptions[dateTimeString];
  }

  setTableOptions() {
    this.dateTimes.forEach((dateTimeString) => {
      this.tableOptions[dateTimeString].data =
        this.getData(dateTimeString);
    });
  }

  getData(dateTimeString) {
    const result = [];

    this.getPartsByDate(dateTimeString).forEach((part) => {
      result.push(this.rowPart(part));
    });

    return result;
  }

  getPartsByDate(dateTimeString) {
    const result = [];
    const parts = this.ReservationPart.partsByReservations(this.reservations);

    parts.forEach((part) => {
      if (this.moment(part.date_time).format('YYYY-MM-DD') === dateTimeString) {
        result.push(part);
      }
    });

    return result;
  }
}

export default SearchCtrl;
