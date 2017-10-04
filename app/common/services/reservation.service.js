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
    this.choose_number_of_persons_is_opened = false;
    this.moment = moment;

    this.pagination = {
      customer: {
        type: 1, date: 2, number_of_persons: 3, product: 4, time: 5, person: 6,
      },
      backend: {
        date: 1, number_of_persons: 2, product: 3, time: 4, zone: 5, group: 6, person: 7,
      },
      edit: {
        date: 1, number_of_persons: 2, product: 3, zone: 4,
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

  getAll(companyId, date) {
    const deferred = this.$q.defer();

    if (!companyId) {
      return deferred.promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/reservation?date=${date}`,
      method: 'GET',
    }).then(result => result.data);
  }

  getPDF(companyId, reservationId) {
    const deferred = this.$q.defer();

    if (!(companyId || reservationId)) {
      return deferred.promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/reservation/${reservationId}/get_pdf`,
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

  exportCSV(companyId, date) {
    const deferred = this.$q.defer();

    if (!companyId) {
      return deferred.promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/reservation?date=${date}&format=csv`,
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

  getAllGrouped(companyId) {
    const deferred = this.$q.defer();

    if (!companyId) {
      return deferred.promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/reservation/grouped`,
      method: 'GET',
    }).then(result => result.data);
  }

  getProducts(companyId) {
    const deferred = this.$q.defer();

    if (!companyId) {
      return deferred.promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/product`,
      method: 'GET',
    }).then(result => result.data);
  }

  getCreateURI(companyId, params) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    const uri = `${API_URL}/company/${companyId}/reservation`;
    const additional = [];
    params.forEach((param) => {
      if (Object.values(param)[0]) {
        const encodedParam = encodeURIComponent(Object.keys(param));
        additional.push(`${encodedParam}=true`); // adding parameters to query string like 'confirm_mail=true' only if Object.values(param)[0] contains true
      }
    });

    return [uri, additional.join('&')].join('?');
  }

  create(companyId, data, params) {
    return this.Upload.upload({
      url: this.getCreateURI(companyId, params),
      data,
    }).then(result => result.data);
  }

  createQuick(companyId, data) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/reservation/quick`,
      data,
      method: 'POST',
    }).then(result => result.data);
  }

  updateStatus(companyId, reservationId, data) {
    if (!companyId) {
      return this.$q.defer().promise;
    }

    return this.$http({
      url: `${API_URL}/company/${companyId}/reservation/${reservationId}/update_status`,
      method: 'PATCH',
      data,
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

  openedTimeRangePeriod(availableTime, date) {
    if (!availableTime.length) return [];

    const openedTimes = this.filterFilter(availableTime, { is_open: true });

    if (openedTimes.length > 0) {
      const min = openedTimes[0].time;
      const max = openedTimes[openedTimes.length - 1].time;
      const now = this.moment();
      const formatedDate = this.moment(date).format('YYYY-MM-DD');

      return this.filterFilter(availableTime, item => item.time >= min &&
        item.time <= max &&
        this.moment(`${formatedDate} ${item.time}`) >= now);
    }

    return [];
  }
}
