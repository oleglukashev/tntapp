import angular from 'angular';

export default class Controller {
  constructor(AppConstants, moment, filterFilter, $mdDialog, $q, $scope, $translate, $stateParams) {
    'ngInject';

    this.AppConstants = AppConstants;
    this.moment = moment;
    this.filterFilter = filterFilter;
    this.$mdDialog = $mdDialog;
    this.$translate = $translate;
    this.$stateParams = $stateParams;
    this.$scope = $scope;
    this.max_date = this.AppConstants.calendar.date_options.maxDate;

    this.$onChanges = () => {
      this.current_part = this.reservation.reservation_parts[this.currentIndex];
      this.product_week_time_ranges = this.productWeekTimeRanges;
      this.zone_time_ranges = this.zoneTimeRanges;
      this.open_time_ranges = this.openTimeRanges;
      this.product_time_ranges = this.productTimeRanges;
      this.current_tab_index = this.currentTabIndex;

      this.initTranslates();
      this.initDate();
      this.initMinDate();
      this.initDateOptions();

      if (this.type !== 'customer') {
        this.max_date = undefined;
      }
    };
  }

  changeDatePostProcess() {
    this.current_part.number_of_persons = null;
    this.current_part.product = null;
    this.current_part.time = null;

    if (this.current_part.date) {
      this.selectTab({ index: this.pagination.date });
      this.checkDeadlineAndClosedDate();
    }
  }

  initTranslates() {
    this.no_reservations_today_more_text = '';
    this.back_text = '';
    this.$translate(['notifications.no_reservations_today_more', 'back']).then((translates) => {
      this.no_reservations_today_more_text = translates['notifications.no_reservations_today_more'];
      this.back_text = translates.back;
    }, (translationIds) => {
      this.no_reservations_today_more_text = translationIds['notifications.no_reservations_today_more'];
      this.back_text = translationIds.back;
    });
  }

  initMinDate() {
    this.min_date = new Date();

    if (this.$stateParams.start_date) {
      const minDate = this.moment(this.$stateParams.start_date, 'DD-MM-YYYY').toDate();

      if (minDate !== 'Invalid Date') {
        this.min_date = minDate;
        this.current_part.date = minDate;
      }
    }
  }

  initDate() {
    if (this.$stateParams.date) {
      const date = this.moment(this.$stateParams.date, 'DD-MM-YYYY').toDate();

      if (date !== 'Invalid Date') {
        this.current_part.date = date;
      }
    }
  }

  initDateOptions() {
    this.dateOptions = Object.assign({}, this.AppConstants.calendar.date_options);
    this.dateOptions.minDate = this.min_date;
    this.dateOptions.maxDate = this.max_date;
    this.dateOptions.dateDisabled = ({ date }) => this.disableDates(date);
  }

  disableDates(date) {
    // TODO REFACTOR AFTER NEW RESERVATION REFACTORING
    if (this.type !== 'customer') {
      return false;
    }

    let result = true;

    const disabledProductsData = this.disabledProductsData(date);
    const disabledZonesData = this.disabledZonesData(date);

    Object.keys(disabledProductsData).forEach((productId) => {
      if (!disabledProductsData[productId]) {
        result = false;
      }
    });

    if (!Object.values(disabledZonesData).includes(false)) {
      result = true;
    }

    return result;
  }

  disabledProductsData(date) {
    const dateFormat = this.moment(date).format('YYYY-MM-DD');
    const dateWeekDay = this.moment(date).isoWeekday();
    const data = {};

    if (this.products && this.products.length) {
      this.products.forEach((product) => {
        data[product.id] = true;

        if (this.product_week_time_ranges[dateWeekDay] &&
          this.product_week_time_ranges[dateWeekDay][product.id]) {
          const timeRange = this.product_week_time_ranges[dateWeekDay][product.id];
          data[product.id] = !timeRange.value;
        }

        if (this.open_time_ranges[dateFormat]) {
          const timeRange = this.open_time_ranges[dateFormat];

          if (timeRange.value) {
            data[product.id] = false;
          } else if (!timeRange.value && timeRange.whole_day) {
            data[product.id] = true;
          }
        }

        if (this.product_time_ranges[dateFormat] &&
          this.product_time_ranges[dateFormat][product.id]) {
          const timeRange = this.product_time_ranges[dateFormat][product.id];

          if (timeRange.value) {
            data[product.id] = false;
          } else if (!timeRange.value && timeRange.whole_day) {
            data[product.id] = true;
          }
        }

        if (product.shaded) {
          data[product.id] = true;
        }
      });
    }

    return data;
  }

  disabledZonesData(date) {
    const dateFormat = this.moment(date).format('YYYY-MM-DD');
    const data = {};

    if (this.zones && this.zones.length) {
      this.zones.forEach((zone) => {
        data[zone.id] = false;

        if (this.zone_time_ranges[dateFormat] &&
          this.zone_time_ranges[dateFormat][zone.id]) {
          const timeRange = this.zone_time_ranges[dateFormat][zone.id];

          if (!timeRange.value && timeRange.whole_day) {
            data[zone.id] = true;
          }
        }
      });
    }

    return data;
  }

  checkDeadlineAndClosedDate() {
    if (this.type === 'customer' &&
      this.settings &&
      this.settings.reservation_deadline) {
      const now = this.moment();
      const formattedSelectedDate = this.moment(this.current_part.date).format('YYYY-MM-DD');
      const todayDeadline = this.moment(`${formattedSelectedDate} ${this.settings.reservation_deadline}`);
      const todayEnd = this.moment(`${formattedSelectedDate} 23:59:59`);
      const moreThanDeadline = now >= todayDeadline && now <= todayEnd;

      if (moreThanDeadline) {
        this.selectTab(1);
        this.current_part.date = null;
        this.$mdDialog.show(this.$mdDialog.alert()
          .parent(angular.element(document.querySelector('.modal-dialog')))
          .clickOutsideToClose(true)
          .textContent(this.no_reservations_today_more_text)
          .ok(this.back_text));
      }
    }
  }

  refreshDatepicker() {
    // hook for datepicker bootstrap
    this.$scope.$broadcast('refreshDatepickers');
  }

  canShow() {
    return this.current_tab_index === this.pagination.date - 1;
  }
}
