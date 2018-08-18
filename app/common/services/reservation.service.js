import angular from 'angular';

export default class Reservation {
  constructor(moment, $http, $q, filterFilter, $mdDialog) {
    'ngInject';

    this.moment = moment;
    this.$http = $http;
    this.$q = $q;
    this.$mdDialog = $mdDialog;

    this.filterFilter = filterFilter;
    this.moment = moment;

    this.pagination = {
      customer: {
        type: 1, date: 2, number_of_persons: 3, product: 4, time: 5, person: 6,
      },
      dashboard: {
        date: 1, number_of_persons: 2, product: 3, time: 4, zone: 5, group: 6, person: 7,
      },
      edit: {
        number_of_persons: 1, product: 2, zone: 3,
      },
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
      const link = window.document.createElement('a');
      link.setAttribute('href', encodeURI(result.data));
      link.setAttribute('download', `reservation(#${reservationId}).pdf`);
      link.click();
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
    if (!companyId || !data) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/reservation`,
      skipAuthorization: skipJwtAuth,
      method: 'POST',
      data,
    }).then(result => result, error => error);
  }

  update(companyId, reservationId, data, skipJwtAuth) {
    if (!companyId || !data) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/reservation/${reservationId}`,
      skipAuthorization: skipJwtAuth,
      method: 'PATCH',
      data,
    }).then(result => result, error => error);
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
    }).then(result => result, error => error);
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

  generalNumberOfPersons(tables, tableIds) {
    let result = 0;

    tableIds.forEach((tableId) => {
      const numberOfPersons = this.getPersonCountByTableId(tables, tableId);
      if (numberOfPersons) result += numberOfPersons;
    });

    return result;
  }
}
