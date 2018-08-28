import angular from 'angular';
import limitsSettingsProductsView from './settings_products.limits.view.html';
import limitsSettingsProductsController from './settings_products.limits.controller';
import editMinMaxSettingsProductsView from './settings_products.edit_minmax.view.html';
import editMinMaxSettingsProductsController from './settings_products.edit_minmax.controller';
import newProductSettingsProductView from './settings_products.new_product.view.html';
import newProductSettingsProductController from './settings_products.new_product.controller';

export default class Controller {
  constructor(User, Product, AppConstants, TimeRange, Slider, $scope, $rootScope,
    $timeout, $window, $uibModal, filterFilter) {
    'ngInject';

    this.current_company_id = User.getCompanyId();

    this.filterFilter = filterFilter;
    this.Product = Product;
    this.TimeRange = TimeRange;
    this.Slider = Slider;
    this.$modal = $uibModal;
    this.$window = $window;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.errors = [];
    this.is_loaded = false;
    this.days = AppConstants.dayOfWeek;
    this.opened = {};
    this.opened[this.days[0]] = true;
    this.data = {};
    this.days_of_week = [1, 2, 4, 8, 16, 32, 64];
    this.products_used = [];

    this.slider = this.Slider.getOptions();

    this.loadProducts();
  }

  sliderChanged(id, timeRange) {
    if (!timeRange.options.disabled) {
      const data = {
        product_time_range: {
          startTime: this.Slider.from15Min(timeRange.minValue),
          endTime: this.Slider.from15Min(timeRange.maxValue),
          product: timeRange.product_id,
          dayOfWeekBitfield: [this.days_of_week[timeRange.day]],
          value: timeRange.options.disabled ? 0 : 1,
        },
      };

      this.TimeRange
        .edit(this.current_company_id, id, data)
        .then(
          () => {},
          () => {},
        );

      this.calculateMinMax();
    }
  }

  closeToday(id, timeRange) {
    const data = {
      product_time_range: {
        startTime: this.Slider.from15Min(timeRange.minValue),
        endTime: this.Slider.from15Min(timeRange.maxValue),
        product: timeRange.product_id,
        dayOfWeekBitfield: [this.days_of_week[timeRange.day]],
        value: timeRange.options.disabled ? 1 : 0,
      },
    };

    this.$rootScope.show_spinner = true;
    this.TimeRange
      .edit(this.current_company_id, id, data)
      .then(
        () => {
          this.$rootScope.show_spinner = false;
        },
        () => {
          this.$rootScope.show_spinner = false;
        },
      );

    timeRange.options.disabled = !timeRange.options.disabled;
    this.calculateMinMax();
  }

  showLimits(productId) {
    const modalInstance = this.$modal.open({
      template: limitsSettingsProductsView,
      controller: limitsSettingsProductsController,
      controllerAs: 'ctrl',
      size: 'md',
      resolve: {
        productId: () => productId,
      },
    });

    modalInstance.result.then(() => {}, () => {});
  }

  editMinMax(product) {
    const modalInstance = this.$modal.open({
      template: editMinMaxSettingsProductsView,
      controller: editMinMaxSettingsProductsController,
      controllerAs: 'ctrl',
      size: 'md',
      resolve: {
        product: () => product,
      },
    });

    modalInstance.result.then(() => {}, () => {});
  }

  loadProducts() {
    this.Product.getAll(this.current_company_id, true)
      .then(
        (result) => {
          this.products = {};
          result.forEach((product) => {
            this.products[product.id] = product;
          });
          this.loadTimeRanges();
        },
        () => {},
      );
  }

  loadTimeRanges() {
    this.TimeRange.getAllProductTimeRanges(this.current_company_id)
      .then(
        (ranges) => {
          this.data = {};
          this.days.map((day) => {
            if (typeof this.data[day] === 'undefined') {
              this.data[day] = {
                min_time: null,
                max_time: null,
                time_ranges: {},
              };
            }
          });

          ranges.map((range) => {
            const productStartTime = this.Slider.to15Min('00:00'); // product.start_time
            const productEndTime = this.Slider.to15Min('23:45', false); // product.end_time
            range.daysOfWeek.map((day) => {
              const rangeStartTime = this.Slider.to15Min(range.startTime);
              const rangeEndTime = this.Slider.to15Min(range.endTime, false);

              const startTime = Math.max(productStartTime, rangeStartTime);
              const endTime = Math.min(productEndTime, rangeEndTime);
              const options = angular.copy(this.slider.options);

              // options.minLimit = productStartTime;
              // options.maxLimit = productEndTime;
              if (!range.value) options.disabled = true; // disabled ?
              this.products_used[range.name] = 1;
              const dayData = this.data[this.days[day - 1]]
              dayData.time_ranges[range.openHourId] = {
                day: day - 1,
                product_id: range.productId,
                name: range.name,
                minValue: startTime,
                maxValue: endTime,
                options,
              };

              this.calculateMinMax(dayData);
            });
          });

          this.redrawSliders();
          this.is_loaded = true;
        });
  }

  addProduct() {

    const modalInstance = this.$modal.open({
      template: newProductSettingsProductView,
      controller: newProductSettingsProductController,
      controllerAs: 'ctrl',
      size: 'md',
      resolve: {
        products: () => this.products,
      },
    });

    modalInstance.result.then((newProduct) => {
      let productId = 0;
      this.$rootScope.show_spinner = true;

      Object.keys(this.products).forEach((key) => {
        const product = this.products[key];
        if (product.name === newProduct.name) productId = product.id;
      });

      if (productId === 0) {
        const data = {
          start_time: '00:00',
          end_time: '23:45',
          name: newProduct.name,
          icon_class: newProduct.icon,
          min_persons: 1,
        };

        this.Product
          .create(this.current_company_id, data)
          .then(product => {
            this.addTimeRange(newProduct, product.id)
            this.$rootScope.show_spinner = false;
          });
      } else {
        this.addTimeRange(newProduct, productId);
      }

      this.loadProducts();
    });
  }

  addTimeRange(res, productId) {
    this.days.map((day, i) => {
      let arr;

      switch (i) {
        case 0: case 1: case 2: case 3: case 4:
          arr = res.sliderMonFri;
          break;
        case 5:
          arr = res.sliderSat;
          break;
        case 6:
          arr = res.sliderSun;
          break;
        default:
          break;
      }

      if (arr.maxValue === 96) arr.maxValue = 95; // max time fixing to 23:45

      const data = {
        product_time_range: {
          startTime: this.Slider.from15Min(arr.minValue),
          endTime: this.Slider.from15Min(arr.maxValue),
          product: productId,
          dayOfWeekBitfield: this.days_of_week[i],
          value: 1,
        },
      };

      this.TimeRange
        .create(this.current_company_id, data)
        .then(
          (timeRange) => {
            const newTimeRange = {
              id: timeRange.id,
              product_id: timeRange.product.id,
              name: timeRange.product.name,
              minValue: arr.minValue,
              maxValue: arr.maxValue,
              options: angular.copy(this.slider.options),
            };

            this.data[day].time_ranges[timeRange.id] = newTimeRange;
          },
          () => {},
        );
    });

    this.calculateMinMax();
  }

  removeProduct(id) {
    this.$rootScope.show_spinner = true;
    this.Product
      .delete(this.current_company_id, id)
      .then(
        () => {
          this.$rootScope.show_spinner = false;
          this.loadProducts();
          this.days.map((day) => {
            const timeRangesByDay = this.data[day].time_ranges;
            for (let i = 0; i < timeRangesByDay.length; i += 1) {
              if (timeRangesByDay[i].product_id === id) {
                timeRangesByDay.splice(i, 1);
              }
            }
          });
        },
        () => {
          this.$rootScope.show_spinner = false;
        },
      );

    this.calculateMinMax();
  }

  hidden(productId) {
    this.$rootScope.show_spinner = true;
    this.Product
      .hidden(this.current_company_id, productId)
      .then(
        (res) => {
          this.$rootScope.show_spinner = false;
          this.products[productId].shaded = res.hidden;
        },
        () => {
          this.$rootScope.show_spinner = false;
        },
      );

    this.calculateMinMax();
  }

  redrawSliders() {
    // force redraw slider after loading
    this.$timeout(() => {
      this.$scope.$broadcast('rzSliderForceRender');
    });
  }

  calculateMinMax() {
    Object.keys(this.data).forEach((day) => {
      const dayData = this.data[day];
      const minArray = [];
      const maxArray = [];

      Object.keys(dayData.time_ranges).forEach((id) => {
        if (!dayData.time_ranges[id].options.disabled) {
          minArray.push(dayData.time_ranges[id].minValue);
          maxArray.push(dayData.time_ranges[id].maxValue);
        }
      });

      dayData.min_time = minArray.length ? Math.min.apply(null, minArray) : null;
      dayData.max_time = maxArray.length ? Math.max.apply(null, maxArray) : null;
    });
  }
}
