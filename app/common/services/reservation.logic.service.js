export default class ReservationLogic {
  constructor(filterFilter) {
    'ngInject';

    this.filterFilter = filterFilter;
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
