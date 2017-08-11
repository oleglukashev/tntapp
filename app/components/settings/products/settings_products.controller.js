export default class SettingsProductsCtrl {
  constructor(User, Product, AppConstants, TimeRange, Slider, $scope, $timeout, $window, $modal) {
    'ngInject';

    this.current_company = User.current_company;

    this.Product = Product;
    this.TimeRange = TimeRange;
    this.Slider = Slider;
    this.$modal = $modal;
    this.$window = $window;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.is_loaded = false;
    this.errors = [];
    this.opened = [true];
    this.days = AppConstants.dayOfWeek;
    this.days_of_week = [1, 2, 4, 8, 16, 32, 64];
    this.products_used = [];

    this.slider = this.Slider.getOptions();

    this.loadProducts();
  }

  sliderChanged(day, id) {
    if (!this.products_by_day[day][id].options.disabled) {
      const timeRange = this.products_by_day[day][id];
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
        .edit(this.current_company.id, timeRange.id, data)
          .then(() => {
          },
          () => {
          });
    }
  }

  closeToday(day, id) {
    const timeRange = this.products_by_day[day][id];
    const data = {
      product_time_range: {
        startTime: this.Slider.from15Min(timeRange.minValue),
        endTime: this.Slider.from15Min(timeRange.maxValue),
        product: timeRange.product_id,
        dayOfWeekBitfield: [this.days_of_week[timeRange.day]],
        value: timeRange.options.disabled ? 1 : 0,
      },
    };

    this.TimeRange
      .edit(this.current_company.id, timeRange.id, data)
        .then(() => {
        },
        () => {
        });

    timeRange.options.disabled = !timeRange.options.disabled;
  }

  loadProducts() {
    this.Product.getAll(this.current_company.id, true)
      .then(
        (result) => {
          this.products = {};
          result.forEach((product) => {
            this.products[product.id] = product;
          });
          this.loadTimeRanges();
        },
        () => {
        });
  }

  loadTimeRanges() {
    this.TimeRange.getAll(this.current_company.id)
      .then(
        (ranges) => {
          this.products_by_day = [];
          this.days.map((day) => {
            if (typeof this.products_by_day[day] !== 'object') {
              this.products_by_day[day] = [];
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

              const options = Object.assign({}, this.slider.options);

              // options.minLimit = productStartTime;
              // options.maxLimit = productEndTime;
              if (!range.value) options.disabled = true; // disabled ?

              this.products_used[range.name] = 1;

              this.products_by_day[this.days[day - 1]].push({
                id: range.openHourId,
                day: day - 1,
                product_id: range.productId,
                name: range.name,
                minValue: startTime,
                maxValue: endTime,
                options,
              });
            });
          });
          this.redrawSliders();

          this.is_loaded = true;
        },
        () => {
        });
  }

  addProduct() {
    const modalInstance = this.$modal.open({
      templateUrl: 'settings_products.new_product.view.html',
      controller: 'SettingsProductsNewProductCtrl as new_product',
      size: 'md',
      resolve: {
        products: () => {
          return this.products;
        },
      },
    });


    modalInstance.result.then((newProduct) => {
      let productId = 0;

      Object.keys(this.products).forEach((key) => {
        const product = this.products[key];
        if (product.name === newProduct.name) productId = product.id;
      });

      if (productId === 0) {
        const data = {
          product: {
            startTime: '00:00',
            endTime: '23:45',
            name: newProduct.name,
            icon_class: newProduct.icon,
            minPersons: 1,
          },
        };

        this.Product
          .create(this.current_company.id, data)
          .then(
            product => this.addTimeRange(newProduct, product.id),
          );
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
        .create(this.current_company.id, data)
          .then(() => {
            const product = {
              id: productId,
              name: res.name,
              minValue: arr.minValue,
              maxValue: arr.maxValue,
              options: Object.assign({}, this.slider.options),
            };

            this.products_by_day[day].push(product);
          },
          () => {
          });
    });
  }

  removeProduct(id) {
    this.Product
      .delete(this.current_company.id, id)
        .then(() => {
          this.loadProducts();
          this.days.map((day) => {
            const productsDay = this.products_by_day[day];
            for (let i = 0; i < productsDay.length; i += 1) {
              if (productsDay[i].product_id === id) {
                productsDay.splice(i, 1);
              }
            }
          });
        },
        () => {
        });
  }

  hidden(productId) {
    this.Product
      .hidden(this.current_company.id, productId)
        .then((res) => {
          this.products[productId].hidden = res.hidden;
        },
        () => {
        });
  }

  redrawSliders() {
    // force redraw slider after loading
    this.$timeout(() => {
      this.$scope.$broadcast('rzSliderForceRender');
    });
  }
}
