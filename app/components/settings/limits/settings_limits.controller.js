import angular from 'angular';

export default class SettingsLimitsCtrl {
  constructor(User, Settings, AppConstants, moment, $window, $rootScope) {
    'ngInject';

    this.current_company_id = User.getCompanyId();

    this.Settings = Settings;
    this.moment = moment;
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

  loadLimits() {
    this.Settings
      .getLimitsSettings(this.current_company_id).then(
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
      .saveLimitsSettings(this.current_company_id, data)
        .then(() => {});
  }

  setLimit(time, dayOfWeek, limit) {
    if (!this.limits[dayOfWeek]) {
      this.limits[dayOfWeek] = {};
    }

    this.limits[dayOfWeek][time] = limit;
  }

  setLimits(limits) {
    angular.forEach(limits, (limit) => {
      this.setLimit(limit.time, limit.day_of_week, limit.limit);
    });
  }

  buildLimit(time, dayOfWeek, limit) {
    return {
      dayOfWeek: dayOfWeek,
      time: time,
      limit: limit,
    };
  }
}
