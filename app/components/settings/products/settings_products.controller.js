import angular from 'angular';

export default class SettingsProductsCtrl {
  constructor(User, Product, TimeRange, Slider, filterFilter, $scope, $timeout, $window, $modal) {
    'ngInject';

    this.current_company = User.current_company;

    this.Product         = Product;
    this.TimeRange       = TimeRange;
    this.Slider          = Slider;
    this.filterFilter    = filterFilter;
    this.$modal          = $modal;
    this.$window         = $window;
    this.$scope          = $scope;
    this.$timeout        = $timeout;
    this.is_loaded       = false;
    this.errors          = [];
    this.opened          = [true];
    this.days            = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'];
    this.days_of_week    = [1, 2, 4, 8, 16, 32, 64];
    this.products_used   = [];

    this.slider = this.Slider.getOptions();

    this.loadProducts();
  }

  sliderChanged(day, id) {
    if (!this.products_by_day[day][id].options.disabled) {
      let timeRange = this.products_by_day[day][id];
      let data = {
        'product_time_range': {
          'startTime'        : this.Slider.from15Min(timeRange.minValue),
          'endTime'          : this.Slider.from15Min(timeRange.maxValue),
          'product'          : timeRange.product_id,
          'dayOfWeekBitfield': [this.days_of_week[timeRange.day]],
          'value'            : timeRange.options.disabled ? 0 : 1,
        }
      }

      this.TimeRange
        .edit(this.current_company.id, timeRange.id, data )
          .then(() => {
          },
          (error) => {
          });
    }
  }

  closeToday(day, id) {
    let timeRange = this.products_by_day[day][id];
    let data = {
      'product_time_range': {
        'startTime'        : this.Slider.from15Min(timeRange.minValue),
        'endTime'          : this.Slider.from15Min(timeRange.maxValue),
        'product'          : timeRange.product_id,
        'dayOfWeekBitfield': [this.days_of_week[timeRange.day]],
        'value'            : timeRange.options.disabled ? 1 : 0,
      }
    }

    this.TimeRange
      .edit(this.current_company.id, timeRange.id, data )
        .then(() => {
        },
        (error) => {
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
        (error) => {
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
            let product          = this.products[range.product_id];
            let productStartTime = this.Slider.to15Min('00:00'); //product.start_time
            let productEndTime   = this.Slider.to15Min('23:59', false); //product.end_time
            range.daysOfWeek.map((day) => {
              let rangeStartTime = this.Slider.to15Min(range.startTime);
              let rangeEndTime   = this.Slider.to15Min(range.endTime, false);

              let startTime = Math.max(productStartTime, rangeStartTime);
              let endTime   = Math.min(productEndTime, rangeEndTime);

              let options = Object.assign({}, this.slider.options);

              // options.minLimit = productStartTime;
              // options.maxLimit = productEndTime;
              if (!range.value) options.disabled = true; // disabled ?

              this.products_used[range.name] = 1;

              this.products_by_day[this.days[day-1]].push({
                id        : range.openHourId,
                day       : day-1,
                product_id : range.productId,
                id        : range.openHourId,
                name      : range.name,
                minValue  : startTime,
                maxValue  : endTime,
                options   : options
              })
            });

          });
          this.redrawSliders();

          this.is_loaded = true;
        },
        (error) => {
        });
  }

  addProduct() {
    let modalInstance = this.$modal.open({
      templateUrl: 'settings_products.new_product.view.html',
      controller: 'SettingsProductsNewProductCtrl as new_product',
      size: 'md',
      resolve: {
        products: () => {
          return this.products;
        },
        prosucts_used: () => {
          let res = [];
          this.TimeRange.getAll(this.current_company.id).then((ranges) => {
            this.ranges = ranges;

            this.ranges.map((range) => {
              res.push(range.name)
            });
          });

          return res;
        }
      }
    });


    modalInstance.result.then((new_product) => {
      let product_id = 0;
      Object.keys(this.products).forEach(key => {
        let product = this.products[key];
        if (product.name == new_product.name) product_id = product.id;
      });

      if (product_id == 0) {
        let data = {
          'product': {
            'startTime'  : '00:00',
            'endTime'    : '23:59',
            'name'       : new_product.name,
            'icon_class' : new_product.icon,
            'minPersons' : 1
        }};

        this.Product
          .create(this.current_company.id, data)
          .then(
            product => this.addTimeRange(new_product, product.id),
            error   => {}
          );
      } else {
        this.addTimeRange(new_product, product_id)
      }

      this.loadProducts();
    });
  }

  addTimeRange(res, product_id) {
    this.days.map((day, i) => {
      let arr;
      let data = {};

      switch(i) {
        case 0: case 1: case 2: case 3: case 4:
          arr = res['sliderMonFri'];
          break;
        case 5:
          arr = res['sliderSat'];
          break;
        case 6:
          arr = res['sliderSun'];
          break;
        }

        if (arr['maxValue'] == 96) arr['maxValue'] = 95; // max time fixing to 23:45

        data = {
          'product_time_range': {
            'startTime'        : this.Slider.from15Min(arr['minValue']),
            'endTime'          : this.Slider.from15Min(arr['maxValue']),
            'product'          : product_id,
            'dayOfWeekBitfield': this.days_of_week[i],
            'value'            : 1,
          }
        };

        this.TimeRange
          .create(this.current_company.id, data)
            .then(() => {
              let product = {
                id      : product_id,
                name    : res['name'],
                minValue: arr['minValue'],
                maxValue: arr['maxValue'],
                options : Object.assign({}, this.slider.options)
              }

              this.products_by_day[day].push(product)
            },
            (error) => {
            });
    });
  }

  removeProduct(id) {
    this.Product
      .delete(this.current_company.id, id )
        .then(() => {
          this.loadProducts();
          this.days.map((day) => {
            let products_day = this.products_by_day[day];
            for (let i=0; i<products_day.length; i++) {
              if (products_day[i].product_id == id) {
                products_day.splice(i, 1);
              }
            }
          });
        },
        (error) => {
        });
  }

  hidden(product_id) {
    this.Product
      .hidden(this.current_company.id, product_id )
        .then((res) => {
          this.products[product_id].hidden = res.hidden;
        },
        (error) => {
        });
  }

  redrawSliders() {
    // force redraw slider after loading
    this.$timeout(() => {
      this.$scope.$broadcast('rzSliderForceRender');
    });
  }
}