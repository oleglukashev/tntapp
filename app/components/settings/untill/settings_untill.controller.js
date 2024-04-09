import angular from 'angular';

export default class Controller {
  constructor(User, Table, Settings, Untill, $uibModal, $rootScope, $mdDialog, $state, $stateParams) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Table = Table;
    this.Settings = Settings;
    this.Untill = Untill;
    this.$rootScope = $rootScope;
    this.$modal = $uibModal;
    this.$mdDialog = $mdDialog;
    this.$state = $state;

    this.untill_tables = [];
    this.page = parseInt($stateParams.page) || 1;
    this.per_page = 5;

    this.is_loaded = false;

    this.userIsManager = User.isManager.bind(User);
    if (this.userIsManager()) {
      this.loadTables();
    } else {
      // no access
      window.location.href = '/';
    }
  }

  updateTable(table, untill_table_id) {
    this.Table.update(this.current_company_id, { untill_table_id: parseInt(untill_table_id) }, table.id);
  }

  next() {
    this.$state.go('.', { page: this.page + 1 });
  }

  prev() {
    this.$state.go('.', { page: this.page - 1 });
  }

  searchUntillTable(id) {
    return this.Untill.search(this.current_company_id, id).then((result) => {
      return result ? [String(result)] : [];
    });
  }

  checkNextPage(page, perPage) {
    return this.Table.getAll(this.current_company_id, page, perPage);
  }

  changeSearch(table, searchText) {
    if (!searchText) {
      this.Table.update(this.current_company_id, { untill_table_id: null }, table.id);
    }
  }

  loadTables() {
    const page = this.page;
    const perPage = this.per_page;

    this.Table.getAll(this.current_company_id, page, perPage).then((tables) => {
      this.tables = tables;
      this.is_loaded = true;
    });
  }
}
