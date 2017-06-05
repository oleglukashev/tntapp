import angular from 'angular';

export default class SettingsProductsCtrl {
  constructor(User, Product, TimeRange, filterFilter, $scope, $timeout, $window, $modal) {
    'ngInject';

    this.current_company = User.current_company;

    this.Product         = Product;
    this.TimeRange       = TimeRange;
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
    this.products_by_day = [];
    this.products        = [];
    this.products_used   = [];

    this.slider = {
      options: {
        disabled: false,
        floor: 1,
        ceil: 96,
        step: 1,
        minRange: 1,
        pushRange: true,
        draggableRange: true,
        noSwitching: true,
        hideLimitLabels: true,
        translate: (val) => {
      		let min = '00';
      		switch(val % 4) {
      			case 1: {
      				min = '15'
      				break;
      			}
      			case 2: {
      				min = '30'
      				break;
      			}
      			case 3: {
      				min = '45'
      				break;
      			}
      		}
      	  return Math.floor(val/4) + ':' + min;
      	},
      }
    };

    this.loadProducts();
  }

  sliderChanged(day, id) {
    if (!this.products_by_day[day][id].options.disabled) {
      let timeRange = this.products_by_day[day][id];
      let data = {
        'product_time_range': {
          'startTime'        : this.from15Min(timeRange.minValue),
          'endTime'          : this.from15Min(timeRange.maxValue),
          'product'          : timeRange.productId,
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
        'startTime'        : this.from15Min(timeRange.minValue),
        'endTime'          : this.from15Min(timeRange.maxValue),
        'product'          : timeRange.productId,
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
          result.map((product) => {
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
          this.days.map((day) => {
            if (typeof this.products_by_day[day] !== 'object') {
              this.products_by_day[day] = [];
            }
          });

          ranges.map((range) => {
            let product          = this.products[range.productId];
            let productStartTime = this.to15Min('00:00'); //product.start_time
            let productEndTime   = this.to15Min('23:59', false); //product.end_time
            range.daysOfWeek.map((day) => {
              let rangeStartTime = this.to15Min(range.startTime);
              let rangeEndTime   = this.to15Min(range.endTime, false);

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
                productId : range.productId,
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
    }).result.then((res) => {
      let productId = 0;
      this.products.map((product) => {
        if (product.name == res.productName) productId = product.id;
      });
console.log(productId)
      if (!productId) {

        this.Product
          .create(this.current_company.id, {
          'product': {
            'startTime'  : '00:00',
            'endTime'    : '23:59',
            'name'       : res['productName'],
            'minPersons' : 1
          }})
            .then((json) => {
              console.log(json)
              this.addTimeRange(res, json.product_id)
            },
            (error) => {
            });
      } else {
        this.addTimeRange(res, productId)
      }

    });

    modalInstance.result.then((selectedItem) => {
      //success
    }, () => {
      // fail
    });
  }

  addTimeRange(res, productId) {
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
            'startTime'        : this.from15Min(arr['minValue']),
            'endTime'          : this.from15Min(arr['maxValue']),
            'product'          : productId,
            'dayOfWeekBitfield': this.days_of_week[i],
            'value'            : 1,
          }
        };

        this.TimeRange
          .create(this.current_company.id, data)
            .then(() => {
              let product = {
                id      : productId,
                name    : res['productName'],
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
    this.TimeRange
      .delete(this.current_company.id, id )
        .then(() => {
          this.days.map((day) => {
            let products_day = this.products_by_day[day];
            for (let i=0; i<products_day.length; i++) {
              if (products_day[i].productId == id) {
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
    console.log(this.products[product_id].hidden)
        },
        (error) => {
        });
  }

  to15Min(time, round=true) {
    let arr = time.split(':');
    return arr[0]*4 + (round ? Math.round(arr[1]/15) : Math.floor(arr[1]/15)) || 1;
  }

  from15Min(min15) {
    let hours = this.to2Digits(Math.floor(min15/4));
    let mins  = this.to2Digits((min15%4)*15);
    return [hours,mins].join(':');
  }

  to2Digits(dig) {
    return (dig < 10 ? '0' : '') + dig
  }

  redrawSliders() {
    // force redraw slider after loading
    this.$timeout(() => {
      this.$scope.$broadcast('rzSliderForceRender');
    });
  }
}