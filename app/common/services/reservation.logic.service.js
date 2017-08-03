export default class ReservationLogic {
  constructor(filterFilter, $state) {
    'ngInject';

    this.filterFilter = filterFilter;
    this.choose_person_count_is_opened = false;

    this.pagination = {
      customer: { type: 1, date: 2, person_count: 3, product: 4, time: 5, person: 6 },
      backend: { date: 1, person_count: 2, product: 3, time: 4, zone: 5, person: 6 },
    };
  }

  getProductNameByProductId(products, productId) {
    const product = this.filterFilter(products, { id: productId })[0];

    return product ? product.name : null;
  }

  getTableNumberByTableId(tables, tableId) {
    const table = this.filterFilter(tables, { id: tableId })[0];

    return table ? table.table_number : null;
  }

  getPersonCountByTableId(tables, tableId) {
    const table = this.filterFilter(tables, { id: tableId })[0];

    return table ? table.number_of_persons : null;
  }

  isDisabledTableByTableId(tables, occupiedTables, tableId) {
    const table = this.filterFilter(tables, { id: tableId })[0];
    let result = table ? table.hidden === true : false;

    if (!result) {
      result = typeof occupiedTables[tableId] !== 'undefined';
    }

    return result;
  }

  triggerChoosePersonCount() {
    this.choose_person_count_is_opened = !this.choose_person_count_is_opened;
  }
}
