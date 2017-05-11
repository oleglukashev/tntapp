import angular from 'angular';

export default class SettingsLimitsCtrl {
  constructor(Settings, moment, filterFilter, $window) {
    'ngInject';

    this.Settings  				= Settings;
    this.moment 	 				= moment;
    this.is_loaded 				= false;
    this.filterFilter			= filterFilter;
    this.$window					= $window;

    this.days			 				= ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];
    this.limit 						= 1;

    this.loadLimits();
    this.limits 					= {};
  }

  loadLimits() {
  	this.Settings
  		.getLimitsSettings()
  			.then(
          (limits) => {
            this.is_loaded = true;
            this.times 		 = limits.times;
            this.setLimits(limits.limits);
  				});
  }

  saveLimitByTimeAndDay(time, day_of_week) {
  	let new_value = this.getChangedValue();
		let data = [this.buildLimit(time, day_of_week, new_value)];

  	this.setLimit(time, day_of_week, new_value);
  	this.saveLimit(data);
  }

  saveLimitByTime(time) {
  	let data = [];
  	let that = this;
  	
  	angular.forEach(that.days, (day, day_of_week) => {
  		let new_value = that.getChangedValue();

  		that.setLimit(time, day_of_week, new_value);
  		data.push(that.buildLimit(time, day_of_week, new_value));
    });

    that.saveLimit(data);
  }

  saveLimitByDay(day_of_week) {
  	let data = [];
  	let that = this;
  	
  	angular.forEach(that.times, (time) => {
  		let new_value = that.getChangedValue();

  		that.setLimit(time, day_of_week, new_value);
  		data.push(that.buildLimit(time, day_of_week, new_value));
    });

    that.saveLimit(data);
  }

  getChangedValue() {
    return this.limits[day_of_week] && this.limits[day_of_week][time] ? null : this.limit
  }

  saveLimit(data) {
  	this.Settings
  		.saveLimitsSettings(data)
  			.then(
          (limit) => {
            //nothing
  				});
  }

  setLimit(time, day_of_week, limit) {
  	if (! this.limits[day_of_week]) {
  		this.limits[day_of_week] = {};
  	}

  	this.limits[day_of_week][time] = limit;
  }

  setLimits(limits) {
  	let that = this;

  	angular.forEach(limits, (limit) => {
  		that.setLimit(limit.time, limit.day_of_week, limit.limit);
    });
  }

  buildLimit(time, day_of_week, limit) {
  	return {
			dayOfWeek: day_of_week,
			time: time,
			limit: limit
		}
  }
}