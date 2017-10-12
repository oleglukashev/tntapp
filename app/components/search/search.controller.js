class SearchCtrl {
  constructor(Table, User, SearchFactory, Customer, ReservationPart, ReservationStatus,
    ReservationStatusMenu, moment, $scope, $state, $rootScope, $stateParams) {
    'ngInject';

    this.current_company_id = User.getCompanyId();

    this.Table = Table;
    this.moment = moment;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$scope.class = 'collapse';
    this.Customer = Customer;
    this.ReservationPart = ReservationPart;
    this.ReservationStatus = ReservationStatus;
    this.months = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];
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

    SearchFactory(this);
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
}

export default SearchCtrl;
