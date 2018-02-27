import angular from 'angular';

export default class SettingsProductsLimitsCtrl {
  constructor(User, Settings, AppConstants, productId, $window, $rootScope) {
    'ngInject';

    this.current_company_id = User.getCompanyId();

    this.User = User;
    this.Settings = Settings;
    this.productId = productId;

    this.$window = $window;
    this.$rootScope = $rootScope;

    this.days = AppConstants.dayOfWeek;
    this.limit = 1;
    this.type = null;

    this.loadLimits();
    this.loadGeneralSettings();
    this.limits = {};

    this.is_loaded = false;
    this.$rootScope.show_spinner = true;
  }

  setLimits(limits) {
    angular.forEach(limits, (limit) => {
      this.setLimit(limit.time, limit.day_of_week, limit.limit);
    });
  }

  setLimit(time, dayOfWeek, limit) {
    if (!this.limits[dayOfWeek]) {
      this.limits[dayOfWeek] = {};
    }

    this.limits[dayOfWeek][time] = limit;
  }

  saveLimitByTimeAndDay(time, dayOfWeek) {
    if (!this.type) return false;
    const newValue = this.getChangedValue(time, dayOfWeek);
    const data = [this.buildLimit(time, dayOfWeek, newValue)];

    this.setLimit(time, dayOfWeek, newValue);
    this.saveLimit(data);
  }

  saveLimitByTime(time) {
    const data = [];

    angular.forEach(this.days, (day, dayOfWeek) => {
      const newValue = this.getChangedValue(time, dayOfWeek);

      this.setLimit(time, dayOfWeek, newValue);
      data.push(this.buildLimit(time, dayOfWeek, newValue));
    });

    this.saveLimit(data);
  }

  saveLimitByDay(dayOfWeek) {
    const data = [];

    angular.forEach(this.times, (time) => {
      const newValue = this.getChangedValue(time, dayOfWeek);

      this.setLimit(time, dayOfWeek, newValue);
      data.push(this.buildLimit(time, dayOfWeek, newValue));
    });

    this.saveLimit(data);
  }

  getChangedValue(time, dayOfWeek) {
    return this.limits[dayOfWeek] && this.limits[dayOfWeek][time] ? null : this.limit;
  }

  saveLimit(data) {
    this.Settings
      .saveProductsLimitsSettings(this.current_company_id, this.productId, data).then(() => {});
  }

  buildLimit(time, dayOfWeek, limit) {
    return {
      dayOfWeek,
      time,
      limit,
    };
  }

  loadLimits() {
    this.Settings
      .getProductsLimitsSettings(this.current_company_id, this.productId).then(
        (limits) => {
          this.is_loaded = true;
          this.$rootScope.show_spinner = false;
          this.times = limits.times;
          this.setLimits(limits.limits);
        }, () => {
          this.$rootScope.show_spinner = false;
        });
  }

  loadGeneralSettings() {
    this.Settings
      .getGeneralSettings(this.current_company_id).then(
        (generalSettings) => {
          this.type = generalSettings.limit_type;
        });
  }
}
