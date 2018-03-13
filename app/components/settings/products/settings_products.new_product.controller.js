export default class SettingsProductsNewProductCtrl {
  constructor(User, TimeRange, AppConstants, products, Slider, $timeout, $rootScope,
    $scope, $modalInstance, $translate) {
    'ngInject';

    this.current_company_id = User.getCompanyId();

    this.User = User;
    this.Slider = Slider;
    this.products = products;
    this.tabIndex = 0;
    this.$timeout = $timeout;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.item = {};

    this.sliderMonFri = {
      minValue: 0,
      maxValue: 95,
    };

    this.sliderSat = Object.assign({}, this.sliderMonFri);
    this.sliderSun = Object.assign({}, this.sliderMonFri);

    this.sliders = [
      {
        name: 'settings.products.mon_to_fri',
        slider: this.sliderMonFri,
      },
      {
        name: 'weekdays.sat',
        slider: this.sliderSat,
      },
      {
        name: 'weekdays.sun',
        slider: this.sliderSun,
      },
    ];

    this.$modalInstance = $modalInstance;

    this.sliderOptions = this.Slider.getOptions().options;

    this.redrawSliders();

    this.iconsClasses = AppConstants.productsClasses;

    // run translates
    $translate(Object.keys(this.iconsClasses).map(item => `product_examples.${item}`)).then((translates) => {
      const classes = {};
      classes[translates['product_examples.lunch']] = this.iconsClasses.lunch;
      classes[translates['product_examples.brunch']] = this.iconsClasses.brunch;
      classes[translates['product_examples.diner']] = this.iconsClasses.diner;
      classes[translates['product_examples.drink']] = this.iconsClasses.drink;
      classes[translates['product_examples.breakfast']] = this.iconsClasses.breakfast;
      this.iconsClasses = classes;
      const loadedProducts = this.productsHash();
      if (loadedProducts) this.iconsClasses = $.extend(loadedProducts, this.iconsClasses);
      this.uniqIcons = [...new Set(Object.values(this.iconsClasses))];
    });
  }

  changeClass(className) {
    this.item.icon_class = className;
  }

  redrawSliders() {
    // force redraw slider after loading
    this.$timeout(() => {
      this.$rootScope.$broadcast('rzSliderForceRender');
    });
  }

  selectProduct() {
    this.sliderOptions.minLimit = 0;
    this.sliderOptions.maxLimit = 95;

    Object.keys(this.products).forEach((key) => {
      const product = this.products[key];
      if (this.item.name === product.name) {
        const startTime = this.Slider.to15Min('00:00'); // product.start_time
        const endTime = this.Slider.to15Min('23:45', false); // product.end_time

        this.sliderMonFri.minValue = startTime;
        this.sliderMonFri.maxValue = endTime;
        this.sliderSat.minValue = startTime;
        this.sliderSat.maxValue = endTime;
        this.sliderSun.minValue = startTime;
        this.sliderSun.maxValue = endTime;
      }
    });
  }

  closeModal() {
    this.$modalInstance.close();
  }

  productsNames() {
    const products = [];
    Object.keys(this.products).map((key) => {
      const product = this.products[key];
      products.push(product.name);
    });
    return products;
  }

  productsHash() {
    const products = {};
    Object.keys(this.products).forEach((key) => {
      const item = this.products[key];
      products[item.name] = (item.icon_class ? item.icon_class :
        this.iconsClasses[item.name]) || this.empty_mdi_class;
    });
    return products;
  }

  submitForm() {
    this.is_submitting = true;
    this.errors = [];
    this.$modalInstance.close({
      name: this.item.name,
      icon: this.item.icon_class,
      sliderMonFri: this.sliderMonFri,
      sliderSat: this.sliderSat,
      sliderSun: this.sliderSun,
    });
  }
}
