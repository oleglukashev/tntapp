import angular from 'angular';

export default class PageFilterTimeRangesCtrl {
  constructor(date, type, title, User, Product, Slider, PageFilterTimeRange, filterFilter, moment, $modalInstance, $window) {
    'ngInject';

    this.current_company     = User.current_company;
    this.PageFilterTimeRange = PageFilterTimeRange;
    this.Slider              = Slider;
    this.Product             = Product;
    this.state               = 'list';
    this.date                = date;
    this.moment              = moment;
    this.$window             = $window;
    this.filterFilter        = filterFilter;
    this.$modalInstance      = $modalInstance;
    this.slider              = this.Slider.getOptions();
    this.type                = type;
    this.title               = title;
    this.products            = [];

    this.loadTimeRange();
  }

  setStateToList() {
    this.state                   = 'list';
    this.form_data               = {};
    this.slider.options.disabled = false;
  }

  edit(time_range) {
    this.state     = 'form';
    this.form_data = time_range;

    if (time_range.whole_day) {
      this.slider.options.disabled = true
    }

    this.slider.minValue = this.Slider.to15Min(time_range.start_time);
    this.slider.maxValue = this.Slider.to15Min(time_range.end_time);
  }

  add() {
    this.state     = 'form';
    this.form_data = {
      whole_day: false,
      fixed_date: this.date,
      value: true
    };

    this.slider.minValue = this.Slider.to15Min('09:00');
    this.slider.maxValue = this.Slider.to15Min('18:00');
  }

  destroy() {
    let time_range = this.filterFilter(this.time_ranges, { id: this.form_data.id})[0];

    if (time_range) {
      let index = this.time_ranges.indexOf(time_range);

      this.PageFilterTimeRange
        .destroy(this.current_company.id, time_range.id)
          .then((result) => {
            this.time_ranges.splice(index, 1);
            this.setStateToList();
          })
    }
  }

  submitForm(is_valid) {
    this.is_submitting = true;

    if (!is_valid) {
      return false;
    }

    let data = {
      start_time: this.Slider.from15Min(this.slider.minValue),
      end_time: this.Slider.from15Min(this.slider.maxValue),
      fixed_date: this.moment(this.form_data.fixed_date).format('YYYY-MM-DD'),
      value: this.form_data.value,
      type: this.type,
      whole_day: this.form_data.whole_day
    }

    if (this.type === 'product' && this.form_data.product) {
      data.product = this.form_data.product.id;
    }

    if (this.form_data.id) {
      delete data.id;

      this.PageFilterTimeRange
        .update(this.current_company.id, this.form_data.id, data)
          .then((result) => {
            this.is_submitting = false;
            let time_range     = this.filterFilter(this.time_ranges, { id: this.form_data.id })[0];

            if (time_range) {
              time_range.start_time = this.Slider.from15Min(this.slider.minValue);
              time_range.end_time   = this.Slider.from15Min(this.slider.maxValue);

              if (this.form_data.fixed_date != this.moment(this.date).format('YYYY-MM-DD')) {
                let index = this.time_ranges.indexOf(time_range);
                this.time_ranges.splice(index, 1);
              }
            }

            this.setStateToList();
          });
    } else {
      this.PageFilterTimeRange
        .create(this.current_company.id, data)
          .then((result) => {
            this.is_submitting = false;

            if (this.form_data.fixed_date == this.date) {
              this.time_ranges.push(result);
            }

            this.setStateToList();
          });
    }
  }

  closeModal() {
    this.$modalInstance.dismiss('cancel');
  }

  destoyWithConfirm() {
    if (confirm('Weet je het zeker?')) {
      this.destroy();
    }
  }

  getProductName(id) {
    let product = this.filterFilter(this.products, { id: id })[0];

    return product ? product.name : null;
  }

  loadTimeRange() {
    this.is_loaded = false;

    this.PageFilterTimeRange
      .getAll(this.current_company.id, this.moment(this.date).format('YYYY-MM-DD'), this.type)
        .then(
          (time_ranges) => {
            this.is_loaded   = true;
            this.time_ranges = time_ranges;

            if (this.type === 'product') {
              this.loadProducts();
            }
          },
          (error) => {
            //nothing
          });
  }

  loadProducts() {
    this.Product
      .getAll(this.current_company.id)
        .then((products) => {
          this.products = products; 
        })
  }
}
