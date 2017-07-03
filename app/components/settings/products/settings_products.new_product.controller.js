export default class SettingsProductsNewProductCtrl {
  constructor(User, TimeRange, prosucts_used, products, Slider, $timeout, $rootScope, $scope, $modalInstance) {
    'ngInject';

    this.current_company = User.current_company;

    this.User             = User;
    this.Slider           = Slider;
    this.prosucts_used    = prosucts_used;
    this.products         = products;
    this.tab_index        = 0;
    this.$timeout         = $timeout;
    this.$rootScope       = $rootScope;
    this.$scope           = $scope;
    this.default_products = ['Lunch', 'Brunch', 'Ontbijt', 'Diner', 'Borrel'];
    this.item             = {};

    this.sliderMonFri = {
        minValue: 1,
        maxValue: 96,
    };

    this.sliderSat = {
        minValue: 1,
        maxValue: 96,
    };

    this.sliderSun = {
        minValue: 1,
        maxValue: 96,
    };
    this.sliders = [
      {
        name   : 'Maandag t/m vrijdag',
        slider : this.sliderMonFri
      },
      {
        name   : 'Zaterdag',
        slider : this.sliderSat
      },
      {
        name   : 'Zondag',
        slider : this.sliderSun
      },
    ];
    this.icons_classes    = {
      'Lunch'   : 'mdi-silverware-variant',
      'Brunch'  : 'mdi-martini',
      'Ontbijt' : 'mdi-food-fork-drink',
      'Diner'   : 'mdi-beach',
      'Borrel'  : 'mdi-food-fork-drink'
    }

    let loadedProducts = this.productsHash();
    if (loadedProducts) this.icons_classes = $.extend(loadedProducts, this.icons_classes)

    this.uniq_icons = [...new Set(Object.values(this.icons_classes))];

    this.$modalInstance = $modalInstance;

    this.sliderOptions = this.Slider.getOptions().options;

    this.redrawSliders();
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
    this.sliderOptions.minLimit = 1;
    this.sliderOptions.maxLimit = 96;

    Object.keys(this.products).forEach(key => {
      let product = this.products[key];
      if (this.item.name == product.name) {
        let startTime = this.Slider.to15Min('00:00'); //product.start_time
        let endTime = this.Slider.to15Min('23:59', false); //product.end_time

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
    let products = [];
    Object.keys(this.products).map(key => {
      let product = this.products[key];
      products.push(product.name)
    });
    return products;
  }

  productsHash() {
    let products = {};
    Object.keys(this.products).forEach(key => {
      let item = this.products[key];
      products[item.name] = (item.icon_class ? item.icon_class : this.icons_classes[item.name]) || this.empty_mdi_class;
    });
    return products;
  }

  submitForm() {
    this.is_submitting = true;
    this.errors        = [];
    this.$modalInstance.close({
      name        : this.item.name,
      icon        : this.item.icon_class,
      sliderMonFri: this.sliderMonFri,
      sliderSat   : this.sliderSat,
      sliderSun   : this.sliderSun
    });
  }
}