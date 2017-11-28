export default class PageFiltertime_rangesCtrl {
  constructor(
    date, type, title, User, Product, Zone, Slider, PageFilterTimeRange,
    filterFilter, moment, $modalInstance, $window,
  ) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.PageFilterTimeRange = PageFilterTimeRange;
    this.Slider = Slider;
    this.Product = Product;
    this.Zone = Zone;
    this.state = 'list';
    this.date = date;
    this.moment = moment;
    this.$window = $window;
    this.filterFilter = filterFilter;
    this.$modalInstance = $modalInstance;
    this.slider = this.Slider.getOptions();
    this.type = type;
    this.value_label = type === 'product' ? 'Geopend' : 'Overboeken';
    this.title = title;
    this.products = [];

    this.loadTimeRange();
  }

  setStateToList() {
    this.state = 'list';
    this.form_data = {};
    this.slider.options.disabled = false;
  }

  edit(timeRange) {
    this.state = 'form';
    this.form_data = timeRange;

    if (timeRange.whole_day) {
      this.slider.options.disabled = true;
    }

    this.slider.minValue = this.Slider.to15Min(timeRange.start_time);
    this.slider.maxValue = this.Slider.to15Min(timeRange.end_time);
  }

  add() {
    this.state = 'form';
    this.form_data = {
      whole_day: false,
      fixed_date: this.date,
      value: true,
    };

    this.slider.minValue = this.Slider.to15Min('09:00');
    this.slider.maxValue = this.Slider.to15Min('18:00');
  }

  destroy() {
    const timeRange = this.filterFilter(this.time_ranges, { id: this.form_data.id })[0];

    if (timeRange) {
      const index = this.time_ranges.indexOf(timeRange);

      this.PageFilterTimeRange
        .destroy(this.current_company_id, timeRange.id)
        .then(() => {
          this.time_ranges.splice(index, 1);
          this.setStateToList();
        });
    }
  }

  submitForm(isValid) {
    this.is_submitting = true;

    if (!isValid) {
      return false;
    }

    const data = {
      start_time: this.Slider.from15Min(this.slider.minValue),
      end_time: this.Slider.from15Min(this.slider.maxValue),
      fixed_date: this.moment(this.form_data.fixed_date).format('YYYY-MM-DD'),
      value: this.form_data.value,
      type: this.type,
      whole_day: this.form_data.whole_day,
    };

    if (this.type === 'product' && this.form_data.product) {
      data.product = this.form_data.product.id;
    }

    if (this.type === 'zone' && this.form_data.zone) {
      data.zone = this.form_data.zone.id;
    }

    if (this.form_data.id) {
      delete data.id;

      this.PageFilterTimeRange
        .update(this.current_company_id, this.form_data.id, data)
        .then(() => {
          this.is_submitting = false;
          const timeRange = this.filterFilter(this.time_ranges, { id: this.form_data.id })[0];

          if (timeRange) {
            timeRange.start_time = this.Slider.from15Min(this.slider.minValue);
            timeRange.end_time = this.Slider.from15Min(this.slider.maxValue);

            if (this.form_data.fixed_date !== this.moment(this.date).format('YYYY-MM-DD')) {
              const index = this.time_ranges.indexOf(timeRange);
              this.time_ranges.splice(index, 1);
            }
          }

          this.setStateToList();
        });
    } else {
      this.PageFilterTimeRange
        .create(this.current_company_id, data)
        .then((result) => {
          this.is_submitting = false;

          if (this.form_data.fixed_date === this.date) {
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
    if (!id) return null;
    const products = this.filterFilter(this.products, { id });
    return products && products.length ? products[0].name : null;
  }

  getZoneName(id) {
    if (!id) return null;
    const zones = this.filterFilter(this.zones, { id });
    return zones && zones.length ? zones[0].name : null;
  }

  loadTimeRange() {
    this.is_loaded = false;

    this.PageFilterTimeRange
      .getAll(this.current_company_id, this.moment(this.date).format('YYYY-MM-DD'), this.type)
      .then(
        (time_ranges) => {
          this.is_loaded = true;
          this.time_ranges = time_ranges;

          if (this.type === 'product') {
            this.loadProducts();
          }

          if (this.type === 'zone') {
            this.loadZones();
          }
        }, () => {},
      );
  }

  loadProducts() {
    this.Product
      .getAll(this.current_company_id)
      .then((products) => {
        this.products = products;
      });
  }

  loadZones() {
    this.Zone
      .getAll(this.current_company_id)
      .then((zones) => {
        this.zones = zones;
      });
  }
}
