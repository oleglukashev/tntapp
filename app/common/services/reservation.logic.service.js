export default class ReservationLogic {
  constructor(filterFilter) {
    'ngInject';

    this.filterFilter = filterFilter;
    this.choose_number_of_persons_is_opened = false;

    this.pagination = {
      customer: { type: 1, date: 2, number_of_persons: 3, product: 4, time: 5, person: 6 },
      backend: { date: 1, number_of_persons: 2, product: 3, time: 4, zone: 5, group: 6, person: 7 },
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

    if (!result && occupiedTables) {
      result = typeof occupiedTables[tableId] !== 'undefined';
    }

    return result;
  }

  triggerChooseNumberOfPersons() {
    this.choose_number_of_persons_is_opened = !this.choose_number_of_persons_is_opened;
  }

  openedTimeRangePeriod(availableTime) {
    if (!availableTime.length) return [];

    const openedTimes = this.filterFilter(availableTime, { is_open: true });

    if (openedTimes.length > 0) {
      const min = openedTimes[0].time;
      const max = openedTimes[openedTimes.length - 1].time;

      return this.filterFilter(availableTime, item => item.time >= min && item.time <= max);
    } else {
      return [];
    }
  }
}
