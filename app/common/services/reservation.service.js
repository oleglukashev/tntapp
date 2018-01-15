import angular from 'angular';

export default class Reservation {
  constructor(JWT, Upload, moment, $http, $q, filterFilter) {
    'ngInject';

    this.moment = moment;
    this.$http = $http;
    this.$q = $q;
    this.JWT = JWT;
    this.Upload = Upload;

    this.filterFilter = filterFilter;
    this.moment = moment;

    this.pagination = {
      customer: {
        type: 1, date: 2, number_of_persons: 3, product: 4, time: 5, person: 6,
      },
      backend: {
        date: 1, number_of_persons: 2, product: 3, time: 4, zone: 5, group: 6, person: 7,
      },
      edit: {
        number_of_persons: 1, product: 2, zone: 3,
      },
    };

    this.init_date = new Date();
    this.max_date = this.moment().add(1, 'Y');
    this.format = 'dd-MM-yyyy';

    this.date_options = {
      formatYear: 'yy',
      startingDay: 1,
      showWeeks: false,
      class: 'datepicker',
    };
  }

  getAll(companyId, date, skipJwtAuth) {
    const deferred = this.$q.defer();

    if (!companyId) {
      return deferred.promise;
    }

    let dateParam = '';
    if (date) dateParam = `date=${date}`;

    return this.$http({
      url: `${API_URL}/company/${companyId}/reservation?${dateParam}`,
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then(result => result.data);
  }

  getPDF(companyId, reservationId, skipJwtAuth) {
    const deferred = this.$q.defer();

    if (!(companyId || reservationId)) {
      return deferred.promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/reservation/${reservationId}/get_pdf`,
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then((result) => {
      const anchor = angular.element('<a/>');
      anchor.attr({
        href: encodeURI(result.data),
        target: '_blank',
        download: 'export.pdf',
      })[0].click();
    });
  }

  exportCSV(companyId, date, skipJwtAuth) {
    const deferred = this.$q.defer();

    if (!companyId) {
      return deferred.promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/reservation?date=${date}&format=csv`,
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then((result) => {
      const anchor = angular.element('<a/>');
      anchor.attr({
        href: `data:attachment/csv;charset=utf-8,${encodeURI(result.data)}`,
        target: '_blank',
        download: 'export.csv',
      })[0].click();
    });
  }

  getAllGrouped(companyId, skipJwtAuth) {
    const deferred = this.$q.defer();

    if (!companyId) {
      return deferred.promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/reservation/grouped`,
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then(result => result.data);
  }

  getProducts(companyId, skipJwtAuth) {
    const deferred = this.$q.defer();

    if (!companyId) {
      return deferred.promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/product`,
      skipAuthorization: skipJwtAuth,
      method: 'GET',
    }).then(result => result.data);
  }

  create(companyId, data, skipJwtAuth) {
    const header = skipJwtAuth ? null : { Authorization: `Bearer ${this.JWT.get()}` };

    return this.Upload.upload({
      url: `${API_URL}/company/${companyId}/reservation`,
      skipAuthorization: skipJwtAuth,
      headers: header,
      data,
    }).then(result => result.data);
  }

  createQuick(companyId, data, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/reservation/quick`,
      skipAuthorization: skipJwtAuth,
      data,
      method: 'POST',
    }).then(result => result.data);
  }

  createWalkIn(companyId, data, skipJwtAuth) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/reservation/walk_in`,
      skipAuthorization: skipJwtAuth,
      data,
      method: 'POST',
    }).then(result => result.data);
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
    return table ? parseInt(table.number_of_persons) : null;
  }

  isDisabledTableByTableId(tables, occupiedTables, tableId) {
    const table = this.filterFilter(tables, { id: tableId })[0];
    let result = table ? table.hidden === true : false;

    if (!result && occupiedTables) {
      result = typeof occupiedTables[tableId] !== 'undefined';
    }

    return result;
  }

  generalNumberOfPersons(tables, tableIds) {
    let result = 0;

    tableIds.forEach((tableId) => {
      const numberOfPersons = this.getPersonCountByTableId(tables, tableId);
      if (numberOfPersons) result += numberOfPersons;
    });

    return result;
  }
}
